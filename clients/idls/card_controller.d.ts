import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface ActiveRequest {
  'email' : string,
  'card_code' : string,
  'active_code' : string,
}
export interface AppInfo {
  'app_id' : string,
  'current_version' : Version,
  'latest_version' : Version,
  'wallet_id' : [] | [Principal],
}
export type ChainType = { 'IC' : null } |
  { 'BTC' : null } |
  { 'ETH' : null };
export interface Contract {
  'status' : ContractStatus,
  'card_number' : string,
  'email' : [] | [string],
  'user_address' : [] | [Principal],
  'card_code' : string,
  'active_code' : string,
  'contract_address' : Principal,
  'eoa_address' : [] | [string],
}
export type ContractStatus = { 'NEW' : null } |
  { 'ACTIVATED' : null } |
  { 'DEPLOYING' : null };
export interface ControllerInfo {
  'status' : boolean,
  'chain' : ChainType,
  'name' : string,
  'sub_domain' : string,
  'canister_app_name' : string,
  'mint_type' : MintType,
  'remain_cycle' : bigint,
  'airdrop_canister' : [] | [Principal],
  'amount' : number,
}
export interface CycleInfo {
  'records' : Array<CycleRecord>,
  'estimate_remaining' : bigint,
}
export interface CycleRecord { 'ts' : bigint, 'balance' : bigint }
export interface DeActiveRequest { 'card_code' : string }
export interface GetContractResponse {
  'status' : ContractStatus,
  'email' : [] | [string],
  'card_code' : string,
  'contract_address' : Principal,
  'eoa_address' : [] | [string],
}
export interface LogEntry { 'ts' : bigint, 'msg' : string, 'kind' : string }
export type MintType = { 'ACTIVATED' : null } |
  { 'CREATED' : null };
export interface PremintRequest {
  'card_number' : string,
  'card_code' : string,
  'active_code' : string,
}
export type Result = { 'Ok' : Contract } |
  { 'Err' : SystemError };
export type Result_1 = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_10 = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_11 = { 'Ok' : Array<LogEntry> } |
  { 'Err' : string };
export type Result_12 = { 'Ok' : [] | [Array<[Principal, string]>] } |
  { 'Err' : string };
export type Result_13 = { 'Ok' : GetContractResponse } |
  { 'Err' : SystemError };
export type Result_2 = { 'Ok' : null } |
  { 'Err' : SystemError };
export type Result_3 = { 'Ok' : [] | [Contract] } |
  { 'Err' : SystemError };
export type Result_4 = { 'Ok' : Array<Contract> } |
  { 'Err' : SystemError };
export type Result_5 = { 'Ok' : AppInfo } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : Array<[string, Array<Principal>]> } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : Array<CycleRecord> } |
  { 'Err' : string };
export type Result_9 = { 'Ok' : CycleInfo } |
  { 'Err' : string };
export interface SystemError { 'msg' : string, 'code' : number }
export interface Version {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export interface _SERVICE {
  'activate' : ActorMethod<[ActiveRequest], Result>,
  'balance_get' : ActorMethod<[], Result_1>,
  'cards_export' : ActorMethod<[], Uint8Array | number[]>,
  'cards_import' : ActorMethod<[Uint8Array | number[]], undefined>,
  'contract_change_active_code' : ActorMethod<[string, string], Result_2>,
  'contract_change_code' : ActorMethod<[string, string], Result_3>,
  'contract_list' : ActorMethod<[ContractStatus], Result_4>,
  'contract_list_all' : ActorMethod<[], Result_4>,
  'contract_premint' : ActorMethod<[PremintRequest], Result_2>,
  'controller_get' : ActorMethod<[], ControllerInfo>,
  'controller_init' : ActorMethod<
    [string, ChainType, string, MintType],
    undefined
  >,
  'controller_status_toggle' : ActorMethod<[], undefined>,
  'deactivate' : ActorMethod<[DeActiveRequest], Result>,
  'ego_app_info_get' : ActorMethod<[], Result_5>,
  'ego_app_info_update' : ActorMethod<
    [[] | [Principal], string, Version],
    undefined
  >,
  'ego_app_version_check' : ActorMethod<[], Result_5>,
  'ego_canister_add' : ActorMethod<[string, Principal], Result_6>,
  'ego_canister_delete' : ActorMethod<[], Result_6>,
  'ego_canister_list' : ActorMethod<[], Result_7>,
  'ego_canister_remove' : ActorMethod<[string, Principal], Result_6>,
  'ego_canister_track' : ActorMethod<[], Result_6>,
  'ego_canister_untrack' : ActorMethod<[], Result_6>,
  'ego_canister_upgrade' : ActorMethod<[], Result_6>,
  'ego_controller_add' : ActorMethod<[Principal], Result_6>,
  'ego_controller_remove' : ActorMethod<[Principal], Result_6>,
  'ego_controller_set' : ActorMethod<[Array<Principal>], Result_6>,
  'ego_cycle_check' : ActorMethod<[], Result_6>,
  'ego_cycle_estimate_set' : ActorMethod<[bigint], Result_6>,
  'ego_cycle_history' : ActorMethod<[], Result_8>,
  'ego_cycle_info' : ActorMethod<[], Result_9>,
  'ego_cycle_recharge' : ActorMethod<[bigint], Result_6>,
  'ego_cycle_threshold_get' : ActorMethod<[], Result_1>,
  'ego_is_op' : ActorMethod<[], Result_10>,
  'ego_is_owner' : ActorMethod<[], Result_10>,
  'ego_is_user' : ActorMethod<[], Result_10>,
  'ego_log_list' : ActorMethod<[bigint], Result_11>,
  'ego_op_add' : ActorMethod<[Principal], Result_6>,
  'ego_op_list' : ActorMethod<[], Result_12>,
  'ego_op_remove' : ActorMethod<[Principal], Result_6>,
  'ego_owner_add' : ActorMethod<[Principal], Result_6>,
  'ego_owner_add_with_name' : ActorMethod<[string, Principal], Result_6>,
  'ego_owner_list' : ActorMethod<[], Result_12>,
  'ego_owner_remove' : ActorMethod<[Principal], Result_6>,
  'ego_owner_set' : ActorMethod<[Array<Principal>], Result_6>,
  'ego_runtime_cycle_threshold_get' : ActorMethod<[], Result_1>,
  'ego_user_add' : ActorMethod<[Principal], Result_6>,
  'ego_user_list' : ActorMethod<[], Result_12>,
  'ego_user_remove' : ActorMethod<[Principal], Result_6>,
  'ego_user_set' : ActorMethod<[Array<Principal>], Result_6>,
  'fix_contract_status' : ActorMethod<[], Result_2>,
  'get_contract' : ActorMethod<[string], Result_13>,
  'get_my_contracts' : ActorMethod<[], Array<Contract>>,
  'mint_exist' : ActorMethod<[DeActiveRequest], Result_2>,
}
