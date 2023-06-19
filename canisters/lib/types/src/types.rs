// use ic_cdk::api::time;
use candid::{CandidType, Deserialize, Principal};
use ego_types::app::EgoError;
use icrc_ledger_types::icrc1::account::Subaccount;
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum ChainType {
    IC,
    ETH,
    BTC,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum AirdropType {
    Token,
    NFT,
    Custom,
    None,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum MintType {
    CREATED,
    ACTIVATED,
}

pub type CanisterId = Principal;

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum WalletType {
    IC,
    EVM(String),
    BTC,
    MIXED,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum ICTokenType {
    ICP,
    ICRC1,
    WICP,
    NONE,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum BTCNFTType {
    Ordinal,
    Stamp,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum ICNFTType {
    EXT,
    DIP721,
    NONE,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum EVMNFTType {
    ERC721,
    ERC1155,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum EVMTokenType {
    ERC20,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum AirdropCampaignType {
    IcToken(ICTokenType),
    IcNft(ICNFTType),
    EvmToken(EVMTokenType),
    EvmNft(EVMNFTType),
    BtcNft(BTCNFTType),
    BTC,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct AirdropCampaign {
    pub controller_id: CanisterId,
    pub campaign_id: u64,
    pub campaign_name: Option<String>,
    pub airdrop_type: AirdropType,
    pub airdrop_total_supply: u64,
    pub airdrop_current_count: u64,
    pub airdrop_amount: u64,
    pub airdrop_start_time: Option<u64>,
    pub airdrop_end_time: Option<u64>,
    pub airdrop_campaign_type: AirdropCampaignType,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct CreateCampaignRequest {
    pub controller: CanisterId,
    pub campaign_name: Option<String>,
    pub airdrop_type: AirdropType,
    pub airdrop_amount: u64,
    pub airdrop_total_supply: u64,
    pub airdrop_start_time: Option<u64>,
    pub airdrop_end_time: Option<u64>,
    pub airdrop_campaign_type: AirdropCampaignType,
    pub ledger_canister: Option<CanisterId>,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct ICTokenRecord {
    pub caller: CanisterId,
    pub campaign_id: u64,
    pub sender: (CanisterId, Option<Subaccount>),
    pub receiver: (Principal, Option<Subaccount>),
    pub token_type: (ICTokenType, CanisterId),
    pub amount: u64,
    pub timestamp: u64,
    pub tx_id: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct ICNFTRecord {
    pub campaign_id: u64,
    pub sender: (CanisterId, Option<Subaccount>),
    pub receiver: (Principal, Option<Subaccount>),
    pub nft_type: (ICNFTType, CanisterId),
    pub amount: u64,
    pub timestamp: u64,
    pub tx_id: String,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct SystemError {
    pub code: u16,
    pub msg: String,
}

impl SystemError {
    pub fn new(code: u16, msg: &str) -> Self {
        SystemError {
            code,
            msg: msg.to_string(),
        }
    }
}

impl From<std::string::String> for SystemError {
    fn from(msg: String) -> Self {
        SystemError { code: 404, msg }
    }
}

impl From<EgoError> for SystemError {
    fn from(err: EgoError) -> Self {
        SystemError {
            code: err.code,
            msg: err.msg,
        }
    }
}
