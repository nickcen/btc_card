use candid::Principal;
use ic_cdk::export::candid::{CandidType, Deserialize};
use serde::Serialize;

use types::types::{ChainType, MintType};

#[derive(CandidType, Deserialize, Serialize)]
pub struct ControllerMainCreateRequest {
    pub name: String,
    pub sub_domain: String,
    pub chain: ChainType,
    pub canister_app_name: String,
    pub mint_type: MintType
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct ControllerMainAddRequest {
    pub controller_id: Principal,
    pub name: String,
    pub chain: ChainType,
    pub canister_app_name: String,
    pub mint_type: MintType,
    pub airdrop_canister: Option<Principal>
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct ControllerMainUpgradeRequest {
    pub canister_id: Principal,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct ControllerMainReInstallRequest {
    pub canister_id: Principal,
}
