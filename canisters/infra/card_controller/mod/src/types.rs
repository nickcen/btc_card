use candid::Principal;
use ic_cdk::export::{
  candid::{CandidType, Deserialize},
  serde::Serialize,
};

use types::types::{ChainType, MintType, SystemError};

use crate::contract::ContractStatus;

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum ControllerError {
  NotFound,
  WrongActiveCode,
  WrongUserAddress,
  AlreadyActivated,
  AlreadyExists,
  ServiceError(String),
  UnknownError(String),
}

impl From<ControllerError> for SystemError {
  fn from(e: ControllerError) -> Self {
    match e {
      ControllerError::NotFound => SystemError::new(404, "Address Not Found"),
      ControllerError::WrongActiveCode => {
        SystemError::new(404, "Active code not right")
      }
      ControllerError::WrongUserAddress => {
        SystemError::new(404, "User Address not right")
      }
      ControllerError::AlreadyActivated => SystemError::new(404, "Already active"),
      ControllerError::AlreadyExists => {
        SystemError::new(404, "Contract already exists")
      }
      ControllerError::ServiceError(r) => {
        SystemError::new(8001, format!("Service Error: {}", r.as_str()).as_str())
      }
      ControllerError::UnknownError(_) => SystemError::new(8003, "unknown error"),
    }
  }
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct ControllerInfo {
  pub name: String,
  pub sub_domain: String,
  pub chain: ChainType,
  pub status: bool,
  pub amount: u16,
  pub remain_cycle: u64,
  pub canister_app_name: String,
  pub mint_type: MintType,
  pub airdrop_canister: Option<Principal>,
}


#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct PremintRequest {
  pub card_number: String,
  pub card_code: String,
  pub active_code: String,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct ImportRequest {
  pub card_code: String,
  pub active_code: String,
  pub contract_address: Principal,
  pub eoa_address:String,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct MintExistRequest {
  pub card_code: String,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct ActiveRequest {
  pub card_code: String,
  pub active_code: String,
  pub email: String,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct DeActiveRequest {
  pub card_code: String,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct GetContractResponse {
  pub contract_address: Principal,
  pub card_code: String,
  pub eoa_address: Option<String>,
  pub status: ContractStatus,
  pub email: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct CardRecord {
  pub card_number: String,    // card上面的序列号
  pub card_code: String,
  pub active_code: String,
  pub contract_address: Principal,
  pub eoa_address: Option<String>,
}
