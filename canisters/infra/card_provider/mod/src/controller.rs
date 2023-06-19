use candid::CandidType;
use ic_cdk::export::Principal;
use serde::{Deserialize, Serialize};

use types::types::{ChainType, MintType};

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct Controller {
  pub id: Principal,
  pub name: String,
  pub sub_domain: String,
  pub chain: ChainType,
  pub mint_type: MintType
}

impl Controller {}
