use ego_lib::ego_store::TEgoStore;
use ego_types::app::{EgoError, UserApp};
use ic_cdk::export::Principal;

use types::types::{ChainType, MintType};

use crate::controller::Controller;
use crate::rpc::card_controller::TCardController;
use crate::state::{info_log_add, PROVIDER};

pub struct Service {}

impl Service {
  pub fn controller_main_list() -> Vec<Controller> {
    PROVIDER.with(|provider| provider.borrow().controller_main_list())
  }

  pub fn controller_main_get(controller_id: &Principal) -> Option<Controller> {
    PROVIDER.with(|provider| provider.borrow().controller_main_get(controller_id))
  }

  pub async fn controller_main_create<S: TEgoStore, C: TCardController>(
    ego_store: S,
    card_controller: C,
    user_id: &Principal,
    name: String,
    sub_domain: String,
    chain: ChainType,
    canister_app_name: String,
    mint_type: MintType
  ) -> Controller {
    info_log_add("1. create controller");
    let user_app: UserApp = match ego_store.wallet_main_new(user_id.clone()).await {
      Ok(user_app) => {
        Ok::<UserApp, EgoError>(user_app)
      }
      Err(e) => {
        panic!("controller_main_create error: {}", e.msg)
      }
    }.unwrap();

    let canister = user_app.canister;

    let controller = PROVIDER.with(|provider| provider.borrow_mut().controller_main_create(&canister.canister_id, name.clone(), sub_domain.clone(), chain.clone(), mint_type.clone()));

    info_log_add("2. init controller");
    card_controller.controller_init(canister.canister_id, name, chain, canister_app_name, mint_type);

    controller
  }
}
