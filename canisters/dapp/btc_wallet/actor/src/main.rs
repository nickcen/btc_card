mod actor;

#[allow(dead_code)]
#[cfg(any(target_arch = "wasm32", test))]
fn main() {}

#[allow(dead_code)]
#[cfg(not(any(target_arch = "wasm32", test)))]
fn main() {
    // use ego_ga::authenticator::*;
    use btc_wallet_mod::types::*;
    use tecdsa_mod::types::*;
    use ego_types::app::{AppId, Version};
    use ego_types::app_info::AppInfo;
    use ego_types::cycle_info::*;
    use ic_cdk::export::Principal;
    use std::collections::BTreeMap;

    candid::export_service!();
    std::print!("{}", __export_service());
}
