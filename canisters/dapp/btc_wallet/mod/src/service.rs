use crate::state::WALLET_STORE;
use crate::types::{CallCanisterArgs, CallResult, ExpiryUser, Settings, WalletStore};
use ic_cdk::export::Principal;
use ic_cdk::{api, caller};
use itertools::Itertools;

impl Default for WalletStore {
    fn default() -> Self {
        WalletStore {
            expiry_users: Default::default(),
            settings: Settings {
                expiry_period: 7 * 24 * 60 * 60 * 1000 * 1000 * 1000,
            },
            local_ga_enabled: false,
            ga_provider: None,
        }
    }
}

pub struct WalletService;

impl WalletService {
    pub fn add_expiry_user(user: Principal, period: Option<u64>) -> ExpiryUser {
        WalletService::remove_all_expiries();
        let actual_period =
            period.map_or_else(|| WalletService::get_setting().expiry_period, |v| v);
        let ts = api::time();
        let rt = ExpiryUser {
            user: user.clone(),
            timestamp: ts.clone(),
            expiry_timestamp: actual_period + ts,
        };
        WALLET_STORE.with(|s| {
            let mut store = s.borrow_mut();
            store.expiry_users.insert(user.clone(), rt.clone());
            rt.clone()
        })
    }

    pub fn set_local_ga(status: bool) -> bool {
        WALLET_STORE.with(|s| {
            let mut store = s.borrow_mut();
            store.local_ga_enabled = status;
            store.local_ga_enabled
        })
    }

    pub fn get_local_ga() -> bool {
        WALLET_STORE.with(|s| s.borrow().local_ga_enabled)
    }

    pub fn get_expiry_user(user: &Principal) -> Option<ExpiryUser> {
        WALLET_STORE.with(|s| {
            let store = s.borrow();
            store
                .expiry_users
                .get(&user.clone())
                .map_or_else(|| None, |s| Some(s.clone()))
        })
    }

    pub fn is_valid_user(user: &Principal) -> bool {
        match WalletService::get_expiry_user(user) {
            None => false,
            Some(r) => {
                if r.timestamp + WalletService::get_setting().expiry_period < ic_cdk::api::time() {
                    WalletService::remove_expiry_user(user);
                    false
                } else {
                    true
                }
            }
        }
    }

    pub fn set_expiry_period(secs: u64) {
        WALLET_STORE.with(|s| {
            let mut store = s.borrow_mut();
            store.settings.expiry_period = secs;
        })
    }

    pub fn remove_expiry_user(user: &Principal) -> Option<ExpiryUser> {
        WALLET_STORE.with(|s| {
            let mut store = s.borrow_mut();
            store.expiry_users.remove(user)
        })
    }

    pub fn set_ga_provider(provider: Principal) {
        WALLET_STORE.with(|s| {
            let mut store = s.borrow_mut();
            store.ga_provider = Some(provider)
        })
    }

    pub fn get_ga_provider() -> Option<Principal> {
        WALLET_STORE.with(|s| {
            let store = s.borrow();
            store.ga_provider.clone()
        })
    }

    pub fn remove_all_expiries() {
        let all_users = WALLET_STORE.with(|s| {
            let store = s.borrow();
            store.expiry_users.values().map(|d| d.clone()).collect_vec()
        });

        for i in all_users.iter() {
            WalletService::remove_if_expiry(&i.user)
        }
    }

    pub fn remove_if_expiry(user: &Principal) {
        WalletService::get_expiry_user(user).map_or_else(
            || (),
            |f| {
                if ic_cdk::api::time() < f.timestamp + WalletService::get_setting().expiry_period {
                    WalletService::remove_expiry_user(user);
                }
            },
        );
    }

    fn get_setting() -> Settings {
        WALLET_STORE.with(|s| s.borrow().settings)
    }

    pub async fn wallet_call(args: CallCanisterArgs<u128>) -> Result<CallResult, String> {
        if api::id() == caller() {
            return Err("Attempted to call forward on self. This is not allowed. Call this method via a different custodian.".to_string());
        }

        match api::call::call_raw128(args.canister, &args.method_name, &args.args, args.cycles)
            .await
        {
            Ok(x) => Ok(CallResult { r#return: x }),
            Err((code, msg)) => Err(format!(
                "An error happened during the call: {}: {}",
                code as u8, msg
            )),
        }
    }
}
