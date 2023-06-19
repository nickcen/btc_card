use candid::Principal;
use ego_lib::ego_canister::TEgoCanister;
use ego_lib::ego_store::TEgoStore;
use itertools::Itertools;

use types::types::{ChainType, MintType, SystemError};

use crate::contract::ContractStatus::{ACTIVATED, NEW};
use crate::contract::{Contract, ContractStatus};
use crate::rpc::btc_wallet::TBTCWallet;
use crate::state::{canister_get_one, info_log_add, CONTROLLER};
use crate::types::{CardRecord, ControllerError};

pub struct Service {}

impl Service {
    pub fn cards_export() -> Vec<CardRecord> {
        let mut ret = vec![];

        CONTROLLER.with(|controller| {
            controller
              .borrow()
              .contracts
              .iter()
              .for_each(|(_card_code, contract)| {
                  ret.push(CardRecord{
                      card_number: contract.card_number.clone(),
                      card_code: contract.card_code.clone(),
                      active_code: contract.active_code.clone(),
                      contract_address: contract.contract_address.clone(),
                      eoa_address: contract.eoa_address.clone(),
                  });
              })
        });

        ret
    }

    pub fn cards_import(cards: Vec<CardRecord>) {
        CONTROLLER.with(|controller| {
            cards.iter().for_each(|card| {
                controller.borrow_mut().contract_import(card)
            })

        })
    }

    pub async fn premint<S: TEgoStore, C: TBTCWallet>(
        ego_store: &S,
        astro_card: &C,
        card_number: String,
        card_code: String,
        active_code: String,
    ) -> Result<(), SystemError> {
        info_log_add("1. check if card_code is exists");

        if let Some(_) =
            CONTROLLER.with(|controller| controller.borrow().contract_get(card_code.as_str()))
        {
            Err(SystemError::from(ControllerError::AlreadyExists))
        } else {
            CONTROLLER.with(|controller| {
                controller
                    .borrow_mut()
                    .contract_add(card_number.clone(), card_code.clone(), active_code);
            });

            let mint_type = CONTROLLER.with(|controller| controller.borrow().mint_type.clone());

            match mint_type {
                MintType::CREATED => {
                    Service::create_contract(ego_store, astro_card, card_code).await
                }
                MintType::ACTIVATED => Ok(()),
            }
        }
    }

    pub async fn mint_exist_card_code<S: TEgoStore, C: TBTCWallet>(
        ego_store: &S,
        astro_card: &C,
        card_code: String,
    ) -> Result<(), SystemError> {
        if let Some(_) =
            CONTROLLER.with(|controller| controller.borrow().contract_get(card_code.as_str()))
        {
            let mint_type = CONTROLLER.with(|controller| controller.borrow().mint_type.clone());

            match mint_type {
                MintType::CREATED => {
                    Service::create_contract(ego_store, astro_card, card_code).await
                }
                MintType::ACTIVATED => Ok(()),
            }
        } else {
            Err(SystemError::from(ControllerError::NotFound))
        }
    }

    pub fn contract_list(status: ContractStatus) -> Vec<Contract> {
        CONTROLLER.with(|controller| {
            controller
                .borrow()
                .contracts
                .values()
                .filter_map(|contract| {
                    if contract.status == status {
                        Some(contract.clone())
                    } else {
                        None
                    }
                })
                .collect_vec()
        })
    }
    pub fn contract_list_all() -> Vec<Contract> {
        CONTROLLER.with(|controller| {
            controller
                .borrow()
                .contracts
                .values()
                .map(|v| v.clone())
                .collect_vec()
        })
    }

    pub fn contract_change_active_code(card_code: String, active_code: String) -> Result<(), SystemError> {
        CONTROLLER.with(|controller| {
            controller
                .borrow_mut()
                .contracts
                .entry(card_code)
                .and_modify(|contract| contract.active_code = active_code);
        });
        Ok(())
    }

    pub fn contract_change_cardcode(
        card_code: String,
        new_code: String,
    ) -> Result<Option<Contract>, SystemError> {
        let rt = CONTROLLER.with(|controller| {
            controller
                .borrow_mut()
                .contract_change_card_code(&card_code, &new_code)
        });
        Ok(rt.clone())
    }

    #[allow(unused_must_use)]
    pub async fn active<S: TEgoStore, C: TBTCWallet, T: TEgoCanister>(
        ego_store: &S,
        astro_card: &C,
        ego_canister: &T,
        card_code: String,
        active_code: String,
        user_address: Principal,
        email: String,
        controller_address: Principal,
    ) -> Result<Contract, SystemError> {
        CONTROLLER.with(|controller| {
            controller.borrow_mut().contract_active(
                card_code.clone(),
                active_code,
                email,
                user_address,
            )
        })?;

        let mint_type = CONTROLLER.with(|controller| controller.borrow().mint_type.clone());

        match mint_type {
            MintType::CREATED => Ok(()),
            MintType::ACTIVATED => {
                let has_canister = CONTROLLER.with(|controller| {
                    let controller_bor = controller.borrow();
                    let contract = controller_bor.contract_get(&card_code).unwrap();
                    contract.contract_address != Principal::anonymous()
                });

                match has_canister {
                    true => {
                        CONTROLLER.with(|controller| {
                            let mut controller_bor = controller.borrow_mut();
                            let contract = controller_bor.contract_get_mut(&card_code).unwrap();
                            contract.status = ContractStatus::ACTIVATED;
                        });
                        Ok(())
                    }
                    false => {
                        let resp =
                            Service::create_contract(ego_store, astro_card, card_code.clone())
                                .await;
                        if resp.is_ok() {
                            CONTROLLER.with(|controller| {
                                let mut controller_bor = controller.borrow_mut();
                                let contract = controller_bor.contract_get_mut(&card_code).unwrap();
                                contract.status = ContractStatus::ACTIVATED;
                            });
                        }
                        resp
                    }
                }
            }
        }?;

        let contract =
            CONTROLLER.with(|controller| controller.borrow_mut().contract_get(&card_code).unwrap());

        info_log_add("1. add user_address as controller");
        ego_canister
            .ego_controller_add(contract.contract_address, user_address)
            .await;

        // info_log_add("2. remove card_controller from controllers");
        // ego_canister.ego_controller_remove(contract.contract_address, controller_address);

        info_log_add("3. set user_address as owner");
        ego_canister.ego_owner_set(contract.contract_address, vec![user_address]);

        Ok(contract)
    }

    #[allow(unused_must_use)]
    pub async fn deactive(card_code: String) -> Result<Contract, SystemError> {
        let contract =
            CONTROLLER.with(|controller| controller.borrow_mut().contract_deactive(card_code))?;

        Ok(contract)
    }

    pub fn get_contract(card_code: String) -> Result<Contract, SystemError> {
        CONTROLLER.with(
            |controller| match controller.borrow().contract_get(card_code.as_str()) {
                None => Err(SystemError::from(ControllerError::NotFound)),
                Some(contract) => Ok(contract.clone()),
            },
        )
    }

    pub fn get_my_contracts(user_id: Principal) -> Vec<Contract> {
        CONTROLLER.with(|controller| {
            controller
                .borrow()
                .contracts
                .iter()
                .filter_map(|(_, contract)| {
                    if contract.user_address.is_some() && contract.user_address.unwrap() == user_id
                    {
                        Some(contract.clone())
                    } else {
                        None
                    }
                })
                .collect_vec()
        })
    }

    async fn create_contract<S: TEgoStore, C: TBTCWallet>(
        ego_store: &S,
        astro_card: &C,
        card_code: String,
    ) -> Result<(), SystemError> {
        let chain = CONTROLLER.with(|controller| controller.borrow().chain.clone());
        let canister_app_name =
            CONTROLLER.with(|controller| controller.borrow().canister_app_name.clone());

        info_log_add(format!("1. create contract {}", canister_app_name.clone()).as_str());
        let user_app = match ego_store
            .wallet_app_install(canister_app_name.clone())
            .await
        {
            Ok(user_app) => Ok(user_app),
            Err(e) => Err(SystemError::from(e.msg)),
        }?;

        let canister = user_app.canister;

        match chain {
            ChainType::IC => {
                info_log_add("2. update contract_address");
                CONTROLLER.with(|controller| {
                    let mut controller_bor = controller.borrow_mut();
                    let contract = controller_bor.contract_get_mut(&card_code).unwrap();
                    contract.contract_address = canister.canister_id;
                    contract.status = ContractStatus::NEW;
                });

                Ok(())
            }
            ChainType::ETH => {
                info_log_add(
                    format!(
                        "2. call {}: {} to get eoa_address",
                        canister_app_name.clone(),
                        canister.canister_id
                    )
                    .as_str(),
                );
                match astro_card
                    .wallet_eoa_address_get(canister.canister_id)
                    .await
                {
                    Ok(eoa_address) => {
                        CONTROLLER.with(|controller| {
                            let mut controller_bor = controller.borrow_mut();
                            let contract = controller_bor.contract_get_mut(&card_code).unwrap();
                            contract.contract_address = canister.canister_id;
                            contract.eoa_address = Some(eoa_address);
                            contract.status = ContractStatus::NEW;
                        });

                        Ok(())
                    }
                    Err(msg) => Err(SystemError::from(msg)),
                }
            }
            ChainType::BTC => {
                info_log_add(
                    format!(
                        "2. call {}: {} to get btc_address",
                        canister_app_name.clone(),
                        canister.canister_id
                    )
                    .as_str(),
                );
                match astro_card
                    .wallet_segwit_address_get(canister.canister_id)
                    .await
                {
                    Ok(eoa_address) => {
                        CONTROLLER.with(|controller| {
                            let mut controller_bor = controller.borrow_mut();
                            let contract = controller_bor.contract_get_mut(&card_code).unwrap();
                            contract.contract_address = canister.canister_id;
                            contract.eoa_address = Some(eoa_address);
                            contract.status = ContractStatus::NEW;
                        });

                        Ok(())
                    }
                    Err(msg) => Err(SystemError::from(msg)),
                }
            }
        }
    }

    pub fn fix_contract_status() {
        CONTROLLER.with(|controller| {
            controller
                .borrow_mut()
                .contracts
                .iter_mut()
                .for_each(|(_, contract)| {
                    if contract.user_address.is_none() && contract.status == ACTIVATED {
                        contract.status = NEW;
                    }
                })
        });
    }
}
