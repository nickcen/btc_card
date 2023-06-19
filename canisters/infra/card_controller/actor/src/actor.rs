// ------------------
//
// **Here are ego dependencies, needed for ego injections**
//
// ------------------
// BTreeMap
use std::collections::{BTreeMap};

use candid::{candid_method};
use ego_lib::ego_canister::EgoCanister;
// ego_macros
use ego_macros::{inject_app_info_api, inject_cycle_info_api, inject_ego_api};
// ego_types
use ego_types::registry::Registry;
use ego_types::user::User;
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use ic_cdk::{caller, id, trap};
// ic_cdk
use ic_cdk_macros::*;
use serde_bytes::ByteBuf;

use card_controller_mod::contract::{Contract, ContractStatus};
// types
use card_controller_mod::controller::Controller;
use card_controller_mod::rpc::btc_wallet::BTCWallet;
use card_controller_mod::service::Service;
// injected macros
use card_controller_mod::state::*;
use card_controller_mod::types::{ActiveRequest, CardRecord, ControllerInfo, DeActiveRequest, GetContractResponse, MintExistRequest, PremintRequest};
use types::types::{ChainType, MintType, SystemError};

// ------------------
//
// **Project dependencies
//
// ------------------

// ------------------
//
// ** injections
//
// ------------------
// injection ego apis
inject_ego_api!();
inject_cycle_info_api!();
inject_app_info_api!();

#[warn(unused_must_use)]
#[init]
#[candid_method(init, rename = "init")]
fn canister_init() {
    let caller = caller();
    info_log_add(format!("card_controller: init, caller is {}", caller.clone()).as_str());
    owner_add(caller);
}

#[derive(Clone, CandidType, Deserialize)]
pub struct StableState {
    controller: Controller,
    users: Option<User>,
    registry: Option<Registry>,
    app_info: Option<AppInfo>,
    cycle_info: Option<CycleInfo>
}

#[pre_upgrade]
pub fn pre_upgrade() {
    info_log_add("enter card_controller pre_upgrade");

    // composite StableState
    let stable_state = StableState {
        controller: card_controller_mod::state::pre_upgrade(),
        users: Some(users_pre_upgrade()),
        registry: Some(registry_pre_upgrade()),
        app_info: Some(app_info_pre_upgrade()),
        cycle_info: Some(cycle_info_pre_upgrade())
    };

    ic_cdk::storage::stable_save((stable_state,)).expect("failed to save stable state");
}

#[post_upgrade]
pub fn post_upgrade() {
    info_log_add("enter card_controller post_upgrade");

    let (state,): (StableState,) =
        ic_cdk::storage::stable_restore().expect("failed to restore stable state");

    card_controller_mod::state::post_upgrade(state.controller);

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
}

///
/// for card_provider
///
#[update(name = "controller_init", guard = "owner_guard")]
#[candid_method(update, rename = "controller_init")]
async fn controller_init(name: String, chain: ChainType, canister_app_name: String, mint_type: MintType) {
    info_log_add("card_controller: controller_init");
    CONTROLLER.with(|controller| {
        let mut controller_bor = controller.borrow_mut();
        controller_bor.name = name;
        controller_bor.chain = chain;
        controller_bor.canister_app_name = canister_app_name;
        controller_bor.mint_type = mint_type;
    });

    info_log_add("register controller as wallet");
    let ego_store_id = canister_get_one("ego_store").unwrap();
    let ego_store = EgoStore::new(ego_store_id);
    match ego_store.wallet_main_register(id()).await {
        Ok(tenant_id) => {
            let _ = ego_canister_add("ego_tenant".to_string(), tenant_id);
        }
        Err(err) => {
            trap(format!("error calling controller_init code:{}, msg:{}",err.code, err.msg).as_str());
        }
    }
}

///
/// business logic for admin
///
///
#[update(name = "controller_get", guard = "owner_guard")]
#[candid_method(update, rename = "controller_get")]
fn controller_get() -> ControllerInfo{
    info_log_add("card_controller: controller_get");

    CONTROLLER.with(|controller| {
        let controller_borrow = controller.borrow();
        ControllerInfo {
            name: controller_borrow.name.clone(),
            sub_domain: controller_borrow.sub_domain.clone(),
            chain: controller_borrow.chain.clone(),
            status: controller_borrow.status.clone(),
            amount: controller_borrow.amount.clone(),
            remain_cycle: controller_borrow.remain_cycle.clone(),
            canister_app_name: controller_borrow.canister_app_name.clone(),
            mint_type: controller_borrow.mint_type.clone(),
            airdrop_canister: controller_borrow.airdrop_canister.clone(),
        }
    })
}

#[update(name = "controller_status_toggle", guard = "owner_guard")]
#[candid_method(update, rename = "controller_status_toggle")]
fn controller_status_toggle() {
    info_log_add("card_controller: controller_status_toggle");

    CONTROLLER.with(|controller| {
       controller.borrow_mut().status = !controller.borrow_mut().status;
    });
}
/********************  数据导出   ********************/
#[update(name = "cards_export", guard = "owner_guard")]
#[candid_method(update, rename = "cards_export")]
async fn cards_export() -> Vec<u8> {
    info_log_add("card_controller: cards_export");

    let cards = Service::cards_export();

    serde_json::to_vec(&cards).unwrap()
}

#[update(name = "cards_import", guard = "owner_guard")]
#[candid_method(update, rename = "cards_import")]
async fn cards_import(chunk: ByteBuf) {
    info_log_add("card_controller: cards_import");

    let data_opt = std::str::from_utf8(chunk.as_slice());
    match data_opt {
        Ok(data) => {
            // return data.to_string();
            let deser_result = serde_json::from_str::<Vec<CardRecord>>(&data);
            match deser_result {
                Ok(cards) => {
                    Service::cards_import(cards);
                }
                Err(_) => trap("deserialize failed"),
            }
        }

        Err(_) => trap("deserialize failed"),
    }
}

#[update(name = "contract_premint", guard = "owner_guard")]
#[candid_method(update, rename = "contract_premint")]
pub async fn contract_premint(req: PremintRequest) -> Result<(), SystemError> {
    info_log_add("card_controller: contract_premint");

    let canister_id = canister_get_one("ego_store").unwrap();
    let ego_store = EgoStore::new(canister_id);

    let btc_wallet = BTCWallet::new();

    Service::premint(&ego_store, &btc_wallet, req.card_number, req.card_code, req.active_code).await
}

#[update(name = "mint_exist", guard = "owner_guard")]
#[candid_method(update, rename = "mint_exist")]
pub async fn mint_exist(req: MintExistRequest) -> Result<(), SystemError> {
    info_log_add("card_controller: min_exist");
    let canister_id = canister_get_one("ego_store").unwrap();
    let ego_store = EgoStore::new(canister_id);
    let btc_wallet = BTCWallet::new();
    Service::mint_exist_card_code(&ego_store, &btc_wallet, req.card_code).await
}

#[update(name = "contract_list", guard = "owner_guard")]
#[candid_method(update, rename = "contract_list")]
pub async fn contract_list(status: ContractStatus) -> Result<Vec<Contract>, SystemError> {
    info_log_add(format!("card_controller: contract_list {:?}", status).as_str());

    Ok(Service::contract_list(status))
}

#[update(name = "contract_list_all", guard = "owner_guard")]
#[candid_method(update, rename = "contract_list_all")]
pub async fn contract_list_all() -> Result<Vec<Contract>, SystemError> {
    info_log_add(format!("card_controller: contract_list_all").as_str());
    Ok(Service::contract_list_all())
}

#[update(name = "contract_change_active_code", guard = "owner_guard")]
#[candid_method(update, rename = "contract_change_active_code")]
pub fn contract_change_active_code(card_code: String, active_code: String) -> Result<(), SystemError> {
    info_log_add("card_controller: contract_change_active_code");

    Service::contract_change_active_code(card_code, active_code)
}

#[update(name = "contract_change_code", guard = "owner_guard")]
#[candid_method(update, rename = "contract_change_code")]
pub fn contract_change_code(
    card_code: String,
    new_code: String,
) -> Result<Option<Contract>, SystemError> {
    info_log_add("card_controller: contract_edit");

    Service::contract_change_cardcode(card_code, new_code)
}

#[update(name = "deactivate", guard = "owner_guard")]
#[candid_method(update, rename = "deactivate")]
pub async fn deactivate(req: DeActiveRequest) -> Result<Contract, SystemError> {
    info_log_add("card_controller: deactivate");
    Service::deactive(req.card_code).await
}

#[update(name = "fix_contract_status", guard = "owner_guard")]
#[candid_method(update, rename = "fix_contract_status")]
pub async fn fix_contract_status() -> Result<(), SystemError> {
    info_log_add("card_controller: fix_status");
    Service::fix_contract_status();
    Ok(())
}

///
/// business logic for user
///
#[update(name = "activate")]
#[candid_method(update, rename = "activate")]
pub async fn activate(req: ActiveRequest) -> Result<Contract, SystemError> {
    info_log_add("card_controller: activate");

    let canister_id = canister_get_one("ego_store").unwrap();
    let ego_store = EgoStore::new(canister_id);

    let btc_wallet = BTCWallet::new();

    let user_address = caller();

    let ego_cansiter = EgoCanister::new();

    Service::active(
        &ego_store,
        &btc_wallet,
        &ego_cansiter,
        req.card_code,
        req.active_code,
        user_address,
        req.email,
        id(),
    )
    .await
}

#[query(name = "get_contract")]
#[candid_method(query, rename = "get_contract")]
pub async fn get_contract(card_code: String) -> Result<GetContractResponse, SystemError> {
    info_log_add("card_controller: get_eoa_address");

    match Service::get_contract(card_code) {
        Ok(contract) => Ok(GetContractResponse {
            contract_address: contract.contract_address,
            card_code: contract.card_code,
            eoa_address: contract.eoa_address,
            status: contract.status,
            email: contract.email,
        }),
        Err(e) => Err(e),
    }
}

#[query(name = "get_my_contracts")]
#[candid_method(query, rename = "get_my_contracts")]
pub async fn get_my_contracts() -> Vec<Contract> {
    info_log_add("card_controller: get_my_contracts");

    let user_id = caller();

    Service::get_my_contracts(user_id)
}

/********************  methods for ego_cycle_threshold_get   ********************/
#[allow(dead_code)]
pub fn cycle_threshold_get() -> u128 {
    1_000_000_000_000
}

#[allow(dead_code)]
pub fn runtime_cycle_threshold_get() -> u128 {
    500_000_000_000
}
