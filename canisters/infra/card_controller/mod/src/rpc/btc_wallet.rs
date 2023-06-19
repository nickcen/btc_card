use async_trait::async_trait;
use ic_cdk::api;
use ic_cdk::api::call::RejectionCode;
use ic_cdk::export::Principal;

use crate::state::error_log_add;

#[async_trait]
pub trait TBTCWallet {
  async fn wallet_eoa_address_get(&self, target_canister_id: Principal)
                                  -> Result<String, String>;

  async fn wallet_segwit_address_get(&self, target_canister_id: Principal)
                                     -> Result<String, String>;
}

pub struct BTCWallet {}

impl BTCWallet {
  pub fn new() -> Self {
    BTCWallet {}
  }
}

#[async_trait]
impl TBTCWallet for BTCWallet {
  async fn wallet_eoa_address_get(
    &self,
    target_canister_id: Principal,
  ) -> Result<String, String> {
    // according whether is local dfx or ic， pass whether true or false
    let call_result = api::call::call(target_canister_id, "wallet_eoa_address_get", (true, ))
      .await
      as Result<(Result<String, String>, ), (RejectionCode, String)>;

    match call_result {
      Ok(resp) => match resp.0 {
        Ok(eoa_address) => Ok(eoa_address),
        Err(msg) => Err(msg),
      },
      Err((code, msg)) => {
        let code = code as u16;
        error_log_add(
          format!(
            "call wallet_eoa_address_get failed. code:{}, msg: {}",
            code, msg
          )
            .as_str(),
        );
        Err(msg)
      }
    }
  }

    async fn wallet_segwit_address_get(&self, target_canister_id: Principal)
                                       -> Result<String, String>{
        let call_result = api::call::call(target_canister_id, "wallet_segwit_address_get", (true, ))
          .await
          as Result<(Result<String, String>, ), (RejectionCode, String)>;

        match call_result {
            Ok(resp) => match resp.0 {
                Ok(eoa_address) => Ok(eoa_address),
                Err(msg) => Err(msg),
            },
            Err((code, msg)) => {
                let code = code as u16;
                error_log_add(
                    format!(
                        "call wallet_eoa_address_get failed. code:{}, msg: {}",
                        code, msg
                    )
                      .as_str(),
                );
                Err(msg)
            }
        }
    }
}
