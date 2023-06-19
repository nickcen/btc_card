use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

use types::types::{ChainType, MintType};

use crate::controller::Controller;

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct Provider {
  pub controllers: Vec<Controller>,
}

impl Default for Provider {
  fn default() -> Self {
    Provider {
      controllers: Default::default()
    }
  }
}

impl Provider {
  pub fn controller_main_list(&self) -> Vec<Controller> {
    self.controllers.clone()
  }

  pub fn controller_main_get(&self, controller_id: &Principal) -> Option<Controller> {
    match self.controllers.iter().find(|controller| &controller.id == controller_id) {
      None => {
        None
      }
      Some(ctrl) => {
        Some(ctrl.clone())
      }
    }
  }

  pub fn controller_main_create(&mut self, id: &Principal, name: String, sub_domain: String, chain: ChainType, mint_type: MintType, ) -> Controller {
    let controller = Controller {
      name,
      id: id.clone(),
      chain,
      mint_type,
      sub_domain
    };

    self.controllers.push(controller.clone());

    controller
  }
}