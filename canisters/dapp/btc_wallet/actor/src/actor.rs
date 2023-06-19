// CDKs
use candid::candid_method;

use ic_cdk::caller;
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use ic_cdk::trap;
use ic_cdk_macros::*;
use std::collections::BTreeMap;

// tECDSA
// use ego_tecdsa_mod::service::manager_guard;

use tecdsa_mod::service::SignerService as ECDSASingerService;

use tecdsa_mod::types::{
    DerivedPath, ECDSAPublicKeyPayload, ManagerPayload, SignatureReply, TSignerManager,
};
use tecdsa_mod::utils::get_derive_path_bytes;

// Omni Wallet
use btc_wallet_mod::types::{CallCanisterArgs, CallResult, ExpiryUser, WalletStore};

use btc_wallet_mod::state::*;
use btc_wallet_mod::util::*;
use ego_types::registry::Registry;
use ego_types::user::User;

use ego_macros::{inject_app_info_api, inject_cycle_info_api, inject_ego_api};

inject_ego_api!();
inject_app_info_api!();
inject_cycle_info_api!();

#[warn(unused_must_use)]
#[init]
#[candid_method(init, rename = "init")]
fn canister_init() {
    let caller = caller();
    info_log_add(format!("btc_wallet: init, caller is {}", caller.clone()).as_str());
    owner_add(caller);
    if caller.as_slice().len() < 29 {
        btc_wallet_mod::service::WalletService::set_ga_provider(caller);
    }
}

#[derive(Clone, CandidType, Deserialize)]
pub struct StableState {
    pub ec_signer: TSignerManager,
    pub omni_state: WalletStore,
    users: Option<User>,
    registry: Option<Registry>,
    app_info: Option<AppInfo>,
    cycle_info: Option<CycleInfo>,
}

#[pre_upgrade]
pub fn pre_upgrade() {
    info_log_add("enter btc_wallet pre_upgrade");

    let stable_state = StableState {
        ec_signer: tecdsa_mod::state::pre_upgrade(),
        omni_state: btc_wallet_mod::state::pre_upgrade(),
        users: Some(users_pre_upgrade()),
        registry: Some(registry_pre_upgrade()),
        app_info: Some(app_info_pre_upgrade()),
        cycle_info: Some(cycle_info_pre_upgrade()),
    };

    ic_cdk::storage::stable_save((stable_state,)).expect("failed to save stable state");
}

#[post_upgrade]
pub fn post_upgrade() {
    info_log_add("enter btc_wallet post_upgrade");

    let (state,): (StableState,) =
        ic_cdk::storage::stable_restore().expect("failed to restore stable state");

    match state.users {
        None => {}
        Some(users) => {
            users_post_upgrade(users);
        }
    }

    match state.registry {
        None => {}
        Some(registry) => {
            registry_post_upgrade(registry);
        }
    }

    match state.app_info {
        None => {}
        Some(app_info) => {
            app_info_post_upgrade(app_info);
        }
    }

    match state.cycle_info {
        None => {}
        Some(cycle_info) => {
            cycle_info_post_upgrade(cycle_info);
        }
    }


    tecdsa_mod::state::post_upgrade(state.ec_signer);
    btc_wallet_mod::state::post_upgrade(state.omni_state);
}

//！ Manager
//！
//！
//！
//！
//！
//！
//
#[query(name = "isManager")]
#[candid_method(query, rename = "isManager")]
pub fn is_manager() -> bool {
    ECDSASingerService::is_manager(caller())
}

#[query(name = "listManager", guard = "owner_guard")]
#[candid_method(query, rename = "listManager")]
pub fn list_manager() -> Vec<ManagerPayload> {
    ECDSASingerService::list_manager()
}

#[update(name = "addManager", guard = "owner_guard")]
#[candid_method(update, rename = "addManager")]
pub fn add_manager(manager: ManagerPayload) {
    ECDSASingerService::add_manager(manager)
}

#[update(name = "removeManager", guard = "owner_guard")]
#[candid_method(update, rename = "removeManager")]
pub fn remove_manager(principal: Principal) {
    ECDSASingerService::remove_manager(principal)
}

#[update(name = "cycleBalance", guard = "owner_guard")]
#[candid_method(update, rename = "cycleBalance")]
pub fn cycle_balance() -> u128 {
    ic_cdk::api::canister_balance128()
}

//！ ECDSA Methods
//！
//！
//！
//！
//！
//！

#[query(name = "ecGetDeriveBytes")]
#[candid_method(query, rename = "ecGetDeriveBytes")]
pub fn ec_get_derive_bytes(path: String) -> Result<DerivedPath, String> {
    get_derive_path_bytes(path)
}

#[update(name = "wallet_eoa_address_get", guard = "owner_guard")]
#[candid_method(update, rename = "wallet_eoa_address_get")]
pub async fn wallet_eoa_address_get(production: bool) -> Result<String, String> {
    info_log_add(format!("btc_wallet: wallet_eoa_address_get with production:{}", production).as_str());
    let key = {
        if production == true {
            "test_key_1"
        } else {
            "dfx_test_key"
        }
    };
    match ECDSASingerService::get_public_key(
        "m/44'/60'/0'/0/0".to_string(),
        Some(key.to_string()), // test_key_1
    )
    .await
    {
        Ok(r) => {
            info_log_add("btc_wallet: get_public_key");
            pubkey_to_address(&r.public_key_uncompressed.clone()).map_or_else(|f| Err(f), |v| Ok(v))
        }
        Err(e) => {
            info_log_add(format!("btc_wallet: error {}", e).as_str());
            Err(e)
        }
    }
}

#[update(name = "ecGetPublicKey", guard = "owner_guard")]
#[candid_method(update, rename = "ecGetPublicKey")]
pub async fn ec_get_public_key(
    path: String,
    key_name: Option<String>,
) -> Result<ECDSAPublicKeyPayload, String> {
    ECDSASingerService::get_public_key(path, key_name).await
}

#[update(name = "wallet_segwit_address_get", guard = "owner_guard")]
#[candid_method(update, rename = "wallet_segwit_address_get")]
pub async fn wallet_segwit_address_get(production: bool) -> Result<String, String> {
    info_log_add(format!("btc_wallet: wallet_segwit_address_get with production:{}", production).as_str());

    let key = {
        if production == true {
            "test_key_1"
        } else {
            "dfx_test_key"
        }
    };
    match ECDSASingerService::get_public_key(
        "m/84'/0'/0'/0/0".to_string(),
        Some(key.to_string()), // test_key_1
    )
    .await
    {
        Ok(r) => {
            info_log_add("btc_wallet: get_public_key");

            pubkey_to_segwit(&r.public_key.clone()).map_or_else(|f| Err(f), |v| Ok(v))
        }
        Err(e) => {
            info_log_add(format!("btc_wallet: error {}", e).as_str());
            Err(e)
        }
    }
}

#[update(name = "ecSign", guard = "owner_guard")]
#[candid_method(update, rename = "ecSign")]
pub async fn ec_sign(path: String, message: Vec<u8>) -> Result<SignatureReply, String> {
    ECDSASingerService::sign(path, message).await
}

#[update(name = "ecSignRecoverable", guard = "owner_guard")]
#[candid_method(update, rename = "ecSignRecoverable")]
pub async fn ec_sign_recoverable(
    path: String,
    message: Vec<u8>,
    chain_id: Option<u32>,
) -> Result<SignatureReply, String> {
    ECDSASingerService::sign_recoverable(path, message, chain_id).await
}

//！ ICP Methods
//！
//！
//！
//！
//！
//！
#[update(name = "proxyCall", guard = "owner_or_valid_user_guard")]
#[candid_method(update, rename = "proxyCall")]
async fn proxy_call(args: CallCanisterArgs<u128>) -> Result<CallResult, String> {
    btc_wallet_mod::service::WalletService::wallet_call(args).await
}

#[update(name = "proxyCallWithGA", guard = "owner_or_valid_user_guard")]
#[candid_method(update, rename = "proxyCallWithGA")]
async fn proxy_call_with_ga(args: CallCanisterArgs<u128>) -> Result<CallResult, String> {
    btc_wallet_mod::service::WalletService::wallet_call(args).await
}

#[update(name = "addExpiryUser", guard = "owner_guard")]
#[candid_method(update, rename = "addExpiryUser")]
async fn add_expiry_user(user: Principal, period: Option<u64>) -> ExpiryUser {
    btc_wallet_mod::service::WalletService::add_expiry_user(user, period)
}

#[update(name = "setExpiryPeriod", guard = "owner_guard")]
#[candid_method(update, rename = "setExpiryPeriod")]
async fn set_expiry_period(secs: u64) {
    btc_wallet_mod::service::WalletService::set_expiry_period(secs)
}

#[update(name = "setLocalGA", guard = "owner_guard")]
#[candid_method(update, rename = "setLocalGA")]
pub async fn set_local_ga(status: bool) -> bool {
    btc_wallet_mod::service::WalletService::set_ga_provider(caller());
    btc_wallet_mod::service::WalletService::set_local_ga(status)
}

#[inline(always)]
pub fn owner_or_valid_user_guard() -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    if is_owner(caller.clone())
        || (btc_wallet_mod::service::WalletService::is_valid_user(&caller.clone()))
    {
        Ok(())
    } else {
        trap(format!("{} unauthorized", caller.to_text()).as_str());
    }
}


/********************  methods for ego_cycle_threshold_get   ********************/
pub fn cycle_threshold_get() -> u128 {
    60_000_000_000
}

pub fn runtime_cycle_threshold_get() -> u128 {
    100_000_000_000
}
