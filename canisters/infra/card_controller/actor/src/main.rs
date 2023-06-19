mod actor;

#[allow(dead_code)]
#[cfg(any(target_arch = "wasm32", test))]
fn main() {}

#[allow(dead_code)]
#[cfg(not(any(target_arch = "wasm32", test)))]
fn main() {
    use card_controller_mod::contract::*;
    use card_controller_mod::types::*;
    use ego_types::app::{AppId, Version};
    use ego_types::app_info::AppInfo;
    use ego_types::cycle_info::*;
    use ic_cdk::export::Principal;
    use types::types::*;
    use std::collections::BTreeMap;
    use serde_bytes::ByteBuf;

    candid::export_service!();
    std::print!("{}", __export_service());
}
