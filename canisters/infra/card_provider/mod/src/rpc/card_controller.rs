use ic_cdk::api;
use ic_cdk::export::Principal;

use types::types::{ChainType, MintType};

pub trait TCardController {
  fn controller_init(&self, target_canister_id: Principal, name: String, chain: ChainType, canister_app_name: String, mint_type: MintType);
}

pub struct CardController {}

impl CardController {
  pub fn new() -> Self {
    CardController {}
  }
}


impl TCardController for CardController {
  fn controller_init(&self, target_canister_id: Principal, name: String, chain: ChainType, canister_app_name: String, mint_type: MintType) {
    let _result = api::call::notify(target_canister_id, "controller_init", (name, chain, canister_app_name, mint_type, ));
  }
}


