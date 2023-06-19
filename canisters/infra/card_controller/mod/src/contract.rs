use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use serde::Serialize;

#[derive(
CandidType, Serialize, Deserialize, Clone, Copy, Debug, Ord, PartialOrd, Eq, PartialEq,
)]
pub enum ContractStatus {
  NEW,
  DEPLOYING,
  ACTIVATED,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Contract {
  pub card_number: String,    // card sequence number, like 000001, 000002
  pub card_code: String,
  pub active_code: String,
  pub contract_address: Principal,
  pub eoa_address: Option<String>,
  pub status: ContractStatus,
  pub email: Option<String>,
  pub user_address: Option<Principal>,
}