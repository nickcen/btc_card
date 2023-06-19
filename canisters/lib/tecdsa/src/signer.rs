use crate::types::{
    DerivedPath, ECDSAPublicKey, ECDSAPublicKeyPayload, ECDSAPublicKeyReply, ECDSASignerSetting,
    EcdsaCurve, EcdsaKeyId, ManagerPayload, SignWithECDSA, SignWithECDSAReply, SignatureReply,
    TSignerManager, TecdsaSigner,
};
use crate::utils::get_derive_path_bytes;

use ic_cdk::export::Principal;
use ic_cdk::{call, id};
use ic_certified_map::Hash;
use itertools::Itertools;
use k256::ecdsa::signature::Signature;
use k256::ecdsa::{recoverable, VerifyingKey};
use k256::elliptic_curve::sec1::ToEncodedPoint;
use k256::FieldBytes;

/// ECDSASigner is implement of GenericSigner, with AsymmetricCrypto Cipher
///
/// "dfx_test_key";
///  #[async_trait]
impl TecdsaSigner {
    /// create a new signer
    fn create(path: String, setting: Option<ECDSASignerSetting>) -> Self {
        let default_settings = setting.map_or_else(
            || ECDSASignerSetting {
                key_name: "dfx_test_key".to_string(),
                cycle_signing: 10_000_000_000,
                curve: EcdsaCurve::Secp256k1,
            },
            |o| o.clone(),
        );
        ic_cdk::println!("{}", default_settings.key_name.clone());
        TecdsaSigner {
            public_key_req: ECDSAPublicKey {
                canister_id: Some(id()),
                derivation_path: get_derive_path_bytes(path.clone())
                    .map_or_else(|e| ic_cdk::trap(&e), |d| d.clone()),
                key_id: EcdsaKeyId {
                    curve: default_settings.curve.clone(),
                    name: default_settings.key_name.clone(),
                },
            },
            setting: default_settings.clone(),
            path_string: hex::encode(path.clone().as_bytes()),
            public_key_res: None,
        }
    }

    pub fn settings(&mut self, settings: ECDSASignerSetting) {
        self.public_key_req.key_id.name = settings.key_name.clone();
        self.public_key_req.key_id.curve = settings.curve.clone();
        self.setting = settings.clone();
    }

    fn get_key_id(&self) -> EcdsaKeyId {
        self.public_key_req.key_id.clone()
    }
    #[allow(dead_code)]
    fn get_key_name(&self) -> String {
        self.public_key_req.key_id.name.clone()
    }

    fn get_derived_path(&self) -> DerivedPath {
        self.public_key_req.derivation_path.clone()
    }
    #[allow(dead_code)]
    fn get_curve(&self) -> EcdsaCurve {
        self.public_key_req.key_id.curve.clone()
    }

    fn get_cycles_signing(&self) -> u64 {
        self.setting.cycle_signing.clone()
    }

    pub fn set_pub_key(&mut self, payload: Option<ECDSAPublicKeyPayload>) {
        self.public_key_res = payload;
    }

    pub async fn get_public_key(&self) -> Result<ECDSAPublicKeyPayload, String> {
        let (res,): (ECDSAPublicKeyReply,) = call(
            Principal::management_canister(),
            "ecdsa_public_key",
            (self.public_key_req.clone(),),
        )
        .await
        .map_err(|e| format!("Failed to call ecdsa_public_key {}", e.1))?;

        let public_key_uncompressed =
            k256::PublicKey::from_sec1_bytes(res.public_key.clone().as_slice())
                .unwrap()
                .to_encoded_point(false)
                .as_bytes()
                .to_vec();

        let payload = ECDSAPublicKeyPayload {
            public_key_uncompressed,
            public_key: res.public_key.clone(),
            chain_code: res.chain_code,
        };

        Ok(payload.clone())
    }

    pub async fn sign(&self, message_hash: Vec<u8>) -> Result<SignatureReply, String> {
        assert_eq!(message_hash.len(), 32);

        let request = SignWithECDSA {
            message_hash: message_hash.clone(),
            derivation_path: self.get_derived_path(),
            key_id: self.get_key_id(),
        };
        let (res,): (SignWithECDSAReply,) = ic_cdk::api::call::call_with_payment(
            Principal::management_canister(),
            "sign_with_ecdsa",
            (request,),
            self.get_cycles_signing(),
        )
        .await
        .map_err(|e| format!("Failed to call sign_with_ecdsa {}", e.1))?;

        Ok(SignatureReply {
            signature: res.signature,
        })
    }

    pub async fn sign_recoverable(
        &self,
        message_hash: Vec<u8>,
        _: Option<u32>,
    ) -> Result<SignatureReply, String> {
        assert_eq!(message_hash.len(), 32);
        // let cid = chain_id.map_or_else(|| 0u32, |v| v);
        let request = SignWithECDSA {
            message_hash: message_hash.clone(),
            derivation_path: self.get_derived_path(),
            key_id: self.get_key_id(),
        };
        let (res,): (SignWithECDSAReply,) = ic_cdk::api::call::call_with_payment(
            Principal::management_canister(),
            "sign_with_ecdsa",
            (request,),
            self.get_cycles_signing(),
        )
        .await
        .map_err(|e| format!("Failed to call sign_with_ecdsa {}", e.1))?;

        let pub_key = self.public_key_res.clone().unwrap().public_key;

        let verifying_key = VerifyingKey::from_sec1_bytes(pub_key.as_slice()).unwrap();
        let digest_bytes = FieldBytes::from_slice(message_hash.as_slice());
        let try_sig = k256::ecdsa::Signature::from_bytes(res.signature.as_slice()).unwrap();

        let ecdsa_sig = recoverable::Signature::from_digest_bytes_trial_recovery(
            &verifying_key,
            &digest_bytes,
            &try_sig,
        )
        .expect("Cannot recover from signatrue");

        let r = ecdsa_sig.r().as_ref().to_bytes();
        let s = ecdsa_sig.s().as_ref().to_bytes();
        let v = u8::from(ecdsa_sig.recovery_id());

        let mut bytes = [0u8; 65];
        if r.len() > 32 || s.len() > 32 {
            return Err("Cannot create secp256k1 signature: malformed signature.".to_string());
        }
        bytes[0..32].clone_from_slice(&r);
        bytes[32..64].clone_from_slice(&s);
        bytes[64] = v;
        ic_cdk::println!("signature byte length: {}", bytes.to_vec().len());
        Ok(SignatureReply {
            signature: bytes.to_vec(),
        })
    }
}

/// signer manager

impl Default for TSignerManager {
    fn default() -> Self {
        TSignerManager {
            signer_map: Default::default(),
            manager: Default::default(),
            message_cache: Default::default(),
        }
    }
}

impl TSignerManager {
    pub fn list_managers(&self) -> Vec<ManagerPayload> {
        self.manager.iter().map(|(_, n)| n.clone()).collect_vec()
    }
    pub fn add_manager(&mut self, manager: ManagerPayload) {
        self.manager
            .insert(manager.principal.clone(), manager.clone());
    }
    pub fn remove_manager(&mut self, principal: Principal) {
        self.manager.remove(&principal);
    }

    pub fn is_manager(&self, principal: Principal) -> bool {
        self.manager.get(&principal).is_some()
    }

    pub fn create_signer(
        &mut self,
        path: String,
        settings: Option<ECDSASignerSetting>,
    ) -> Result<TecdsaSigner, String> {
        let signer = TecdsaSigner::create(path, settings);
        self.add_signer(signer.clone())
    }

    pub fn get_signer(&self, path: String) -> Option<TecdsaSigner> {
        self.signer_map
            .get(&hex::encode(path.as_bytes()))
            .map(|e| e.clone())
    }

    pub fn get_signer_mut(&mut self, path: String) -> Option<&mut TecdsaSigner> {
        self.signer_map
            .get_mut(&hex::encode(path.as_bytes()))
            .map(|e| e)
    }

    fn add_signer(&mut self, signer: TecdsaSigner) -> Result<TecdsaSigner, String> {
        let path_string = signer.path_string.clone();
        match self.signer_map.insert(path_string.clone(), signer.clone()) {
            None => Ok(signer.clone()),
            Some(_) => Err("Signer is taken".to_string()),
        }
    }
    #[allow(dead_code)]
    fn has_signer_path(&self, path: String) -> bool {
        self.signer_map
            .iter()
            .find(|&e| hex::encode(path.as_bytes()) == e.0.clone())
            .is_some()
    }
    pub fn cache_signature(&mut self, hash_key: Hash, reply: SignatureReply) {
        if !self.is_cache(&hash_key) {
            self.message_cache.insert(hash_key, reply);
        }
    }
    #[allow(dead_code)]
    fn prune_signature(&mut self, _: Vec<u8>) {}

    pub fn get_sig_from_cache(&self, hash_key: Hash) -> Option<&SignatureReply> {
        self.message_cache.get(&hash_key)
    }
    fn is_cache(&self, hash: &Hash) -> bool {
        self.message_cache.get(hash).is_some()
    }
}
