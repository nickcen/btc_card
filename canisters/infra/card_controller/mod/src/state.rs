use std::cell::RefCell;

use ego_macros::{inject_app_info, inject_cycle_info, inject_ego_data};

use crate::controller::Controller;

inject_ego_data!();
inject_cycle_info!();
inject_app_info!();

/********************  methods for canister_registry_macro   ********************/
fn on_canister_added(name: &str, canister_id: Principal) {
    info_log_add(
        format!(
            "on_canister_added name: {}, canister_id: {}",
            name.to_string(),
            canister_id.to_text()
        )
        .as_str(),
    );
}

thread_local! {
    pub static CONTROLLER: RefCell<Controller> = RefCell::new(Controller::default());
}

pub fn pre_upgrade() -> Controller {
    CONTROLLER.with(|s| s.borrow().clone())
}

pub fn post_upgrade(controller: Controller) {
    CONTROLLER.with(|s| s.replace(controller));
}
