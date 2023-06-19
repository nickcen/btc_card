use tecdsa_mod::bitcoin;
use tecdsa_mod::bitcoin::{Network, PublicKey as BTCPublicKey};
use k256::elliptic_curve::sec1::ToEncodedPoint;

pub fn pubkey_to_address(pubkey: &[u8]) -> Result<String, String> {
    let uncompressed_pubkey = {
        if pubkey.len() != 65 {
            k256::PublicKey::from_sec1_bytes(pubkey.clone())
                .unwrap()
                .to_encoded_point(false)
                .as_bytes()
                .to_vec()
        } else {
            pubkey.clone().to_vec()
        }
    };
    let hash = keccak256(&uncompressed_pubkey[1..65]);
    let mut result = [0u8; 20];
    result.copy_from_slice(&hash[12..]);
    Ok(hex::encode(result))
}

/// Compute the Keccak-256 hash of input bytes.
pub fn keccak256(bytes: &[u8]) -> [u8; 32] {
    use tiny_keccak::{Hasher, Keccak};
    let mut output = [0u8; 32];
    let mut hasher = Keccak::v256();
    hasher.update(bytes);
    hasher.finalize(&mut output);
    output
}

pub fn pubkey_to_segwit(bytes: &[u8]) -> Result<String, String> {
    let compressed = BTCPublicKey::from_slice(bytes).unwrap();
    ic_cdk::print(format!("compressed: {:?}", compressed.to_string()));
    let address = bitcoin::Address::p2wpkh(&compressed, Network::Bitcoin);
    match address {
        Ok(r) => Ok(r.to_string()),
        Err(e) => Err(e.to_string()),
    }
}
