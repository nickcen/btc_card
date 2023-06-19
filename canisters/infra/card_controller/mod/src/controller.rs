use std::collections::HashMap;

use candid::Principal;
use ic_cdk::export::{
  candid::{CandidType, Deserialize},
  serde::Serialize,
};

use types::types::{ChainType, MintType, SystemError};

use crate::contract::{Contract, ContractStatus};
use crate::contract::ContractStatus::NEW;
use crate::types::{CardRecord, ControllerError};

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct Controller {
  pub name: String,
  pub sub_domain: String,
  pub chain: ChainType,
  pub status: bool,
  pub amount: u16,
  pub remain_cycle: u64,
  pub canister_app_name: String,
  pub mint_type: MintType,
  pub airdrop_canister: Option<Principal>,
  pub contracts: HashMap<String, Contract>,
}

impl Default for Controller {
  fn default() -> Self {
    Controller {
      name: "".to_string(),
      sub_domain: "".to_string(),
      chain: ChainType::IC,
      status: false,
      amount: 0,
      remain_cycle: 0,
      canister_app_name: "".to_string(),
      contracts: Default::default(),
      mint_type: MintType::CREATED,
      airdrop_canister: None,
    }
  }
}

impl Controller {
  pub fn contract_add(&mut self, card_number: String, card_code: String, active_code: String) {
    self.contracts.entry(card_code.clone()).or_insert(Contract {
      card_number,
      card_code,
      active_code,
      contract_address: Principal::anonymous(),
      eoa_address: None,
      status: ContractStatus::NEW,
      email: None,
      user_address: None,
    });
  }

  pub fn contract_import(&mut self, card: &CardRecord) {
    self.contracts.entry(card.card_code.clone()).and_modify(|contract| {
      contract.card_number = card.card_number.clone();
      contract.card_code = card.card_code.clone();
      contract.active_code = card.active_code.clone();
      contract.contract_address = card.contract_address;
      contract.eoa_address = card.eoa_address.clone();
    }).or_insert(Contract {
      card_number: card.card_number.clone(),
      card_code: card.card_code.clone(),
      active_code: card.active_code.clone(),
      contract_address: card.contract_address,
      eoa_address: card.eoa_address.clone(),
      status: ContractStatus::NEW,
      email: None,
      user_address: None,
    });
  }

  pub fn contract_get(&self, card_code: &str) -> Option<Contract> {
    self.contracts.get(card_code).cloned()
  }

  pub fn contract_get_mut(&mut self, card_code: &str) -> Option<&mut Contract> {
    self.contracts.get_mut(card_code)
  }

  pub fn contract_change_card_code(&mut self, card_code: &str, change_to: &str) -> Option<Contract> {
    if let Some(c) = self.contract_get(card_code) {
      let rt = Contract {
        card_number: c.card_number,
        card_code: change_to.to_string(),
        active_code: c.active_code,
        contract_address: c.contract_address,
        eoa_address: c.eoa_address,
        status: c.status,
        email: c.email,
        user_address: c.user_address,
      };
      self.contracts.insert(change_to.to_string(), rt.clone());
      self.contract_remove(card_code);
      return Some(rt.clone());
    } else {
      None
    }
  }

  pub fn contract_remove(&mut self, card_code: &str) -> Option<Contract> {
    self.contracts.remove(card_code)
  }

  pub fn contract_active(
    &mut self,
    card_code: String,
    active_code: String,
    email: String,
    user_address: Principal,
  ) -> Result<Contract, SystemError> {
    match self.contracts.get_mut(&card_code) {
      None => Err(SystemError::from(ControllerError::NotFound)),
      Some(contract) => {
        if contract.active_code == active_code {
          if contract.status == NEW {
            contract.email = Some(email);
            match self.mint_type {
              MintType::CREATED => {
                contract.status = ContractStatus::ACTIVATED;
              }
              MintType::ACTIVATED => {
                contract.status = ContractStatus::DEPLOYING;
              }
            }
            contract.user_address = Some(user_address);
            Ok(contract.clone())
          } else {
            if contract.email.as_ref().unwrap() == &email {
              Ok(contract.clone())
            } else {
              Err(SystemError::from(ControllerError::AlreadyActivated))
            }
          }
        } else {
          Err(SystemError::from(ControllerError::WrongActiveCode))
        }
      }
    }
  }

  pub fn contract_deactive(&mut self, card_code: String) -> Result<Contract, SystemError> {
    match self.contracts.get_mut(&card_code) {
      None => Err(SystemError::from(ControllerError::NotFound)),
      Some(contract) => {
        contract.email = None;
        contract.user_address = None;
        contract.status = NEW;
        Ok(contract.clone())
      }
    }
  }
}
