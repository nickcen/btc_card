import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AppInfo {
  'app_id' : string,
  'current_version' : Version,
  'latest_version' : Version,
  'wallet_id' : [] | [Principal],
}
export type ChainType = { 'IC' : null } |
  { 'BTC' : null } |
  { 'ETH' : null };
export interface Controller {
  'id' : Principal,
  'chain' : ChainType,
  'name' : string,
  'sub_domain' : string,
  'mint_type' : MintType,
}
export interface ControllerMainCreateRequest {
  'chain' : ChainType,
  'name' : string,
  'sub_domain' : string,
  'canister_app_name' : string,
  'mint_type' : MintType,
}
export interface ControllerMainUpgradeRequest { 'canister_id' : Principal }
export interface CycleInfo {
  'records' : Array<CycleRecord>,
  'estimate_remaining' : bigint,
}
export interface CycleRecord { 'ts' : bigint, 'balance' : bigint }
export interface LogEntry { 'ts' : bigint, 'msg' : string, 'kind' : string }
export type MintType = { 'ACTIVATED' : null } |
  { 'CREATED' : null };
export type Result = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : AppInfo } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : Array<[string, Array<Principal>]> } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : Array<CycleRecord> } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : CycleInfo } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : Array<LogEntry> } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : [] | [Array<[Principal, string]>] } |
  { 'Err' : string };
export interface Version {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export interface _SERVICE {
  'balance_get' : ActorMethod<[], Result>,
  'controller_main_create' : ActorMethod<
    [ControllerMainCreateRequest],
    Controller
  >,
  'controller_main_get' : ActorMethod<[Principal], [] | [Controller]>,
  'controller_main_list' : ActorMethod<[], Array<Controller>>,
  'controller_main_upgrade' : ActorMethod<
    [ControllerMainUpgradeRequest],
    undefined
  >,
  'ego_app_info_get' : ActorMethod<[], Result_1>,
  'ego_app_info_update' : ActorMethod<
    [[] | [Principal], string, Version],
    undefined
  >,
  'ego_app_version_check' : ActorMethod<[], Result_1>,
  'ego_canister_add' : ActorMethod<[string, Principal], Result_2>,
  'ego_canister_delete' : ActorMethod<[], Result_2>,
  'ego_canister_list' : ActorMethod<[], Result_3>,
  'ego_canister_remove' : ActorMethod<[string, Principal], Result_2>,
  'ego_canister_track' : ActorMethod<[], Result_2>,
  'ego_canister_untrack' : ActorMethod<[], Result_2>,
  'ego_canister_upgrade' : ActorMethod<[], Result_2>,
  'ego_controller_add' : ActorMethod<[Principal], Result_2>,
  'ego_controller_remove' : ActorMethod<[Principal], Result_2>,
  'ego_controller_set' : ActorMethod<[Array<Principal>], Result_2>,
  'ego_cycle_check' : ActorMethod<[], Result_2>,
  'ego_cycle_estimate_set' : ActorMethod<[bigint], Result_2>,
  'ego_cycle_history' : ActorMethod<[], Result_4>,
  'ego_cycle_info' : ActorMethod<[], Result_5>,
  'ego_cycle_recharge' : ActorMethod<[bigint], Result_2>,
  'ego_cycle_threshold_get' : ActorMethod<[], Result>,
  'ego_is_op' : ActorMethod<[], Result_6>,
  'ego_is_owner' : ActorMethod<[], Result_6>,
  'ego_is_user' : ActorMethod<[], Result_6>,
  'ego_log_list' : ActorMethod<[bigint], Result_7>,
  'ego_op_add' : ActorMethod<[Principal], Result_2>,
  'ego_op_list' : ActorMethod<[], Result_8>,
  'ego_op_remove' : ActorMethod<[Principal], Result_2>,
  'ego_owner_add' : ActorMethod<[Principal], Result_2>,
  'ego_owner_add_with_name' : ActorMethod<[string, Principal], Result_2>,
  'ego_owner_list' : ActorMethod<[], Result_8>,
  'ego_owner_remove' : ActorMethod<[Principal], Result_2>,
  'ego_owner_set' : ActorMethod<[Array<Principal>], Result_2>,
  'ego_runtime_cycle_threshold_get' : ActorMethod<[], Result>,
  'ego_user_add' : ActorMethod<[Principal], Result_2>,
  'ego_user_list' : ActorMethod<[], Result_8>,
  'ego_user_remove' : ActorMethod<[Principal], Result_2>,
  'ego_user_set' : ActorMethod<[Array<Principal>], Result_2>,
}
