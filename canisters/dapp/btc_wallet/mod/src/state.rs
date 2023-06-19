use std::cell::RefCell;
use crate::types::WalletStore;
use ego_macros::{inject_app_info, inject_cycle_info, inject_ego_data};

inject_ego_data!();
inject_app_info!();
inject_cycle_info!();

/********************  methods for canister_registry_macro   ********************/
fn on_canister_added(name: &str, canister_id: Principal) {
  info_log_add(format!("on_canister_added name: {}, canister_id: {}", name, canister_id).as_str());
}

thread_local! {
    pub static WALLET_STORE: RefCell<WalletStore> = RefCell::new(WalletStore::default());
}

pub fn pre_upgrade() -> WalletStore {
  WALLET_STORE.with(|s| s.take().into())
}

pub fn post_upgrade(stable_state: WalletStore) {
  WALLET_STORE.with(|s| s.replace(stable_state));
}
