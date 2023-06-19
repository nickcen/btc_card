import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AppInfo {
  'app_id' : string,
  'current_version' : Version,
  'latest_version' : Version,
  'wallet_id' : [] | [Principal],
}
export interface CallCanisterArgs {
  'args' : Uint8Array | number[],
  'cycles' : bigint,
  'method_name' : string,
  'canister' : Principal,
}
export interface CallResult { 'return' : Uint8Array | number[] }
export interface CycleInfo {
  'records' : Array<CycleRecord>,
  'estimate_remaining' : bigint,
}
export interface CycleRecord { 'ts' : bigint, 'balance' : bigint }
export interface ECDSAPublicKeyPayload {
  'public_key_uncompressed' : Uint8Array | number[],
  'public_key' : Uint8Array | number[],
  'chain_code' : Uint8Array | number[],
}
export interface ExpiryUser {
  'user' : Principal,
  'expiry_timestamp' : bigint,
  'timestamp' : bigint,
}
export interface LogEntry { 'ts' : bigint, 'msg' : string, 'kind' : string }
export interface ManagerPayload { 'principal' : Principal, 'name' : string }
export type Result = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : Array<Uint8Array | number[]> } |
  { 'Err' : string };
export type Result_10 = { 'Ok' : Array<LogEntry> } |
  { 'Err' : string };
export type Result_11 = { 'Ok' : [] | [Array<[Principal, string]>] } |
  { 'Err' : string };
export type Result_12 = { 'Ok' : CallResult } |
  { 'Err' : string };
export type Result_13 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : ECDSAPublicKeyPayload } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : SignatureReply } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : AppInfo } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : Array<[string, Array<Principal>]> } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : Array<CycleRecord> } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : CycleInfo } |
  { 'Err' : string };
export type Result_9 = { 'Ok' : boolean } |
  { 'Err' : string };
export interface SignatureReply { 'signature' : Uint8Array | number[] }
export interface Version {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export interface _SERVICE {
  'addExpiryUser' : ActorMethod<[Principal, [] | [bigint]], ExpiryUser>,
  'addManager' : ActorMethod<[ManagerPayload], undefined>,
  'balance_get' : ActorMethod<[], Result>,
  'cycleBalance' : ActorMethod<[], bigint>,
  'ecGetDeriveBytes' : ActorMethod<[string], Result_1>,
  'ecGetPublicKey' : ActorMethod<[string, [] | [string]], Result_2>,
  'ecSign' : ActorMethod<[string, Uint8Array | number[]], Result_3>,
  'ecSignRecoverable' : ActorMethod<
    [string, Uint8Array | number[], [] | [number]],
    Result_3
  >,
  'ego_app_info_get' : ActorMethod<[], Result_4>,
  'ego_app_info_update' : ActorMethod<
    [[] | [Principal], string, Version],
    undefined
  >,
  'ego_app_version_check' : ActorMethod<[], Result_4>,
  'ego_canister_add' : ActorMethod<[string, Principal], Result_5>,
  'ego_canister_delete' : ActorMethod<[], Result_5>,
  'ego_canister_list' : ActorMethod<[], Result_6>,
  'ego_canister_remove' : ActorMethod<[string, Principal], Result_5>,
  'ego_canister_track' : ActorMethod<[], Result_5>,
  'ego_canister_untrack' : ActorMethod<[], Result_5>,
  'ego_canister_upgrade' : ActorMethod<[], Result_5>,
  'ego_controller_add' : ActorMethod<[Principal], Result_5>,
  'ego_controller_remove' : ActorMethod<[Principal], Result_5>,
  'ego_controller_set' : ActorMethod<[Array<Principal>], Result_5>,
  'ego_cycle_check' : ActorMethod<[], Result_5>,
  'ego_cycle_estimate_set' : ActorMethod<[bigint], Result_5>,
  'ego_cycle_history' : ActorMethod<[], Result_7>,
  'ego_cycle_info' : ActorMethod<[], Result_8>,
  'ego_cycle_recharge' : ActorMethod<[bigint], Result_5>,
  'ego_cycle_threshold_get' : ActorMethod<[], Result>,
  'ego_is_op' : ActorMethod<[], Result_9>,
  'ego_is_owner' : ActorMethod<[], Result_9>,
  'ego_is_user' : ActorMethod<[], Result_9>,
  'ego_log_list' : ActorMethod<[bigint], Result_10>,
  'ego_op_add' : ActorMethod<[Principal], Result_5>,
  'ego_op_list' : ActorMethod<[], Result_11>,
  'ego_op_remove' : ActorMethod<[Principal], Result_5>,
  'ego_owner_add' : ActorMethod<[Principal], Result_5>,
  'ego_owner_add_with_name' : ActorMethod<[string, Principal], Result_5>,
  'ego_owner_list' : ActorMethod<[], Result_11>,
  'ego_owner_remove' : ActorMethod<[Principal], Result_5>,
  'ego_owner_set' : ActorMethod<[Array<Principal>], Result_5>,
  'ego_runtime_cycle_threshold_get' : ActorMethod<[], Result>,
  'ego_user_add' : ActorMethod<[Principal], Result_5>,
  'ego_user_list' : ActorMethod<[], Result_11>,
  'ego_user_remove' : ActorMethod<[Principal], Result_5>,
  'ego_user_set' : ActorMethod<[Array<Principal>], Result_5>,
  'isManager' : ActorMethod<[], boolean>,
  'listManager' : ActorMethod<[], Array<ManagerPayload>>,
  'proxyCall' : ActorMethod<[CallCanisterArgs], Result_12>,
  'proxyCallWithGA' : ActorMethod<[CallCanisterArgs], Result_12>,
  'removeManager' : ActorMethod<[Principal], undefined>,
  'setExpiryPeriod' : ActorMethod<[bigint], undefined>,
  'setLocalGA' : ActorMethod<[boolean], boolean>,
  'wallet_eoa_address_get' : ActorMethod<[boolean], Result_13>,
  'wallet_segwit_address_get' : ActorMethod<[boolean], Result_13>,
}
