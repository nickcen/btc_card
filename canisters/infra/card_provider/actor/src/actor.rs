// ------------------
//
// **Here are ego dependencies, needed for ego injections**
//
// ------------------
// BTreeMap
use std::collections::BTreeMap;

use candid::candid_method;
use ego_lib::ego_canister::{EgoCanister, TEgoCanister};
// ego_macros
use ego_macros::{inject_app_info_api, inject_cycle_info_api, inject_ego_api};
// ego_types
use ego_types::registry::Registry;
use ego_types::user::User;
use ic_cdk::{caller, id};
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
// ic_cdk
use ic_cdk_macros::*;

use card_provider_mod::controller::Controller;
use card_provider_mod::provider::Provider;
use card_provider_mod::rpc::card_controller::{CardController};
use card_provider_mod::service::Service;
// injected macros
use card_provider_mod::state::*;
use card_provider_mod::types::{ControllerMainCreateRequest, ControllerMainUpgradeRequest};

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
  info_log_add(format!("card_provider: init, caller is {}", caller.clone()).as_str());
  owner_add(caller);
}


#[derive(Clone, CandidType, Deserialize)]
pub struct StableState {
  provider: Provider,
  users: Option<User>,
  registry: Option<Registry>,
  cycle_info: Option<CycleInfo>,
  app_info: Option<AppInfo>
}

#[pre_upgrade]
pub fn pre_upgrade() {
  info_log_add("enter card_provider pre_upgrade");

  // composite StableState
  let stable_state = StableState {
    provider: card_provider_mod::state::pre_upgrade(),
    users: Some(users_pre_upgrade()),
    registry: Some(registry_pre_upgrade()),
    app_info: Some(app_info_pre_upgrade()),
    cycle_info: Some(cycle_info_pre_upgrade()),
  };

  ic_cdk::storage::stable_save((stable_state, )).expect("failed to save stable state");
}

#[post_upgrade]
pub fn post_upgrade() {
  info_log_add("enter card_provider post_upgrade");

  let (state, ): (StableState, ) =
    ic_cdk::storage::stable_restore().expect("failed to restore stable state");

  card_provider_mod::state::post_upgrade(state.provider);

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
/// business logic
///
#[query(name = "controller_main_list", guard = "owner_guard")]
#[candid_method(query, rename = "controller_main_list")]
fn controller_main_list() -> Vec<Controller> {
  info_log_add("card_provider: controller_main_list");
  Service::controller_main_list()
}

#[query(name = "controller_main_get", guard = "owner_guard")]
#[candid_method(query, rename = "controller_main_get")]
pub fn controller_main_get(controller_id: Principal) -> Option<Controller> {
  info_log_add("card_provider: controller_main_get");

  Service::controller_main_get(&controller_id)
}

#[update(name = "controller_main_create", guard = "owner_guard")]
#[candid_method(update, rename = "controller_main_create")]
pub async fn controller_main_create(request: ControllerMainCreateRequest) -> Controller {
  info_log_add("card_provider: controller_main_create");

  let provider_principal = id();

  let ego_store_id = canister_get_one("ego_store").unwrap();
  let ego_store = EgoStore::new(ego_store_id);

  let card_controller = CardController::new();

  let controller = Service::controller_main_create(ego_store, card_controller, &provider_principal, request.name, request.sub_domain, request.chain, request.canister_app_name, request.mint_type).await;

  info_log_add("3. register provider");
  let ego_canister = EgoCanister::new();
  ego_canister.ego_canister_add(controller.id, "provider".to_string(), provider_principal);

  info_log_add("4. register ego_store");
  ego_canister.ego_canister_add(controller.id, "ego_store".to_string(), ego_store_id);

  info_log_add("5. add provider's owner to newly created controller");
  owners().unwrap().iter().for_each(|(principal, _name)| {
    ego_canister.ego_owner_add(controller.id, principal.clone());
  });

  controller
}

#[update(name = "controller_main_upgrade", guard = "owner_guard")]
#[candid_method(update, rename = "controller_main_upgrade")]
pub fn controller_main_upgrade(request: ControllerMainUpgradeRequest) {
  info_log_add("card_provider: controller_main_upgrade");
  let ego_canister = EgoCanister::new();
  ego_canister.ego_canister_upgrade(request.canister_id)
}

/********************  methods for ego_cycle_threshold_get   ********************/
pub fn cycle_threshold_get() -> u128 {
  1_000_000_000_000
}

pub fn runtime_cycle_threshold_get() -> u128 {
  1_000_000_000_000
}