export const idlFactory = ({ IDL }) => {
  const ExpiryUser = IDL.Record({
    'user' : IDL.Principal,
    'expiry_timestamp' : IDL.Nat64,
    'timestamp' : IDL.Nat64,
  });
  const ManagerPayload = IDL.Record({
    'principal' : IDL.Principal,
    'name' : IDL.Text,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Vec(IDL.Nat8)),
    'Err' : IDL.Text,
  });
  const ECDSAPublicKeyPayload = IDL.Record({
    'public_key_uncompressed' : IDL.Vec(IDL.Nat8),
    'public_key' : IDL.Vec(IDL.Nat8),
    'chain_code' : IDL.Vec(IDL.Nat8),
  });
  const Result_2 = IDL.Variant({
    'Ok' : ECDSAPublicKeyPayload,
    'Err' : IDL.Text,
  });
  const SignatureReply = IDL.Record({ 'signature' : IDL.Vec(IDL.Nat8) });
  const Result_3 = IDL.Variant({ 'Ok' : SignatureReply, 'Err' : IDL.Text });
  const Version = IDL.Record({
    'major' : IDL.Nat32,
    'minor' : IDL.Nat32,
    'patch' : IDL.Nat32,
  });
  const AppInfo = IDL.Record({
    'app_id' : IDL.Text,
    'current_version' : Version,
    'latest_version' : Version,
    'wallet_id' : IDL.Opt(IDL.Principal),
  });
  const Result_4 = IDL.Variant({ 'Ok' : AppInfo, 'Err' : IDL.Text });
  const Result_5 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_6 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal))),
    'Err' : IDL.Text,
  });
  const CycleRecord = IDL.Record({ 'ts' : IDL.Nat64, 'balance' : IDL.Nat });
  const Result_7 = IDL.Variant({
    'Ok' : IDL.Vec(CycleRecord),
    'Err' : IDL.Text,
  });
  const CycleInfo = IDL.Record({
    'records' : IDL.Vec(CycleRecord),
    'estimate_remaining' : IDL.Nat64,
  });
  const Result_8 = IDL.Variant({ 'Ok' : CycleInfo, 'Err' : IDL.Text });
  const Result_9 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const LogEntry = IDL.Record({
    'ts' : IDL.Nat64,
    'msg' : IDL.Text,
    'kind' : IDL.Text,
  });
  const Result_10 = IDL.Variant({ 'Ok' : IDL.Vec(LogEntry), 'Err' : IDL.Text });
  const Result_11 = IDL.Variant({
    'Ok' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text))),
    'Err' : IDL.Text,
  });
  const CallCanisterArgs = IDL.Record({
    'args' : IDL.Vec(IDL.Nat8),
    'cycles' : IDL.Nat,
    'method_name' : IDL.Text,
    'canister' : IDL.Principal,
  });
  const CallResult = IDL.Record({ 'return' : IDL.Vec(IDL.Nat8) });
  const Result_12 = IDL.Variant({ 'Ok' : CallResult, 'Err' : IDL.Text });
  const Result_13 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  return IDL.Service({
    'addExpiryUser' : IDL.Func(
        [IDL.Principal, IDL.Opt(IDL.Nat64)],
        [ExpiryUser],
        [],
      ),
    'addManager' : IDL.Func([ManagerPayload], [], []),
    'balance_get' : IDL.Func([], [Result], ['query']),
    'cycleBalance' : IDL.Func([], [IDL.Nat], []),
    'ecGetDeriveBytes' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'ecGetPublicKey' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [Result_2], []),
    'ecSign' : IDL.Func([IDL.Text, IDL.Vec(IDL.Nat8)], [Result_3], []),
    'ecSignRecoverable' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Nat8), IDL.Opt(IDL.Nat32)],
        [Result_3],
        [],
      ),
    'ego_app_info_get' : IDL.Func([], [Result_4], ['query']),
    'ego_app_info_update' : IDL.Func(
        [IDL.Opt(IDL.Principal), IDL.Text, Version],
        [],
        [],
      ),
    'ego_app_version_check' : IDL.Func([], [Result_4], []),
    'ego_canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result_5], []),
    'ego_canister_delete' : IDL.Func([], [Result_5], []),
    'ego_canister_list' : IDL.Func([], [Result_6], []),
    'ego_canister_remove' : IDL.Func([IDL.Text, IDL.Principal], [Result_5], []),
    'ego_canister_track' : IDL.Func([], [Result_5], []),
    'ego_canister_untrack' : IDL.Func([], [Result_5], []),
    'ego_canister_upgrade' : IDL.Func([], [Result_5], []),
    'ego_controller_add' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_controller_remove' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_controller_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_5], []),
    'ego_cycle_check' : IDL.Func([], [Result_5], []),
    'ego_cycle_estimate_set' : IDL.Func([IDL.Nat64], [Result_5], []),
    'ego_cycle_history' : IDL.Func([], [Result_7], []),
    'ego_cycle_info' : IDL.Func([], [Result_8], []),
    'ego_cycle_recharge' : IDL.Func([IDL.Nat], [Result_5], []),
    'ego_cycle_threshold_get' : IDL.Func([], [Result], []),
    'ego_is_op' : IDL.Func([], [Result_9], ['query']),
    'ego_is_owner' : IDL.Func([], [Result_9], ['query']),
    'ego_is_user' : IDL.Func([], [Result_9], ['query']),
    'ego_log_list' : IDL.Func([IDL.Nat64], [Result_10], ['query']),
    'ego_op_add' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_op_list' : IDL.Func([], [Result_11], []),
    'ego_op_remove' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_owner_add' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_owner_add_with_name' : IDL.Func(
        [IDL.Text, IDL.Principal],
        [Result_5],
        [],
      ),
    'ego_owner_list' : IDL.Func([], [Result_11], []),
    'ego_owner_remove' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_owner_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_5], []),
    'ego_runtime_cycle_threshold_get' : IDL.Func([], [Result], []),
    'ego_user_add' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_user_list' : IDL.Func([], [Result_11], []),
    'ego_user_remove' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_user_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_5], []),
    'isManager' : IDL.Func([], [IDL.Bool], ['query']),
    'listManager' : IDL.Func([], [IDL.Vec(ManagerPayload)], ['query']),
    'proxyCall' : IDL.Func([CallCanisterArgs], [Result_12], []),
    'proxyCallWithGA' : IDL.Func([CallCanisterArgs], [Result_12], []),
    'removeManager' : IDL.Func([IDL.Principal], [], []),
    'setExpiryPeriod' : IDL.Func([IDL.Nat64], [], []),
    'setLocalGA' : IDL.Func([IDL.Bool], [IDL.Bool], []),
    'wallet_eoa_address_get' : IDL.Func([IDL.Bool], [Result_13], []),
    'wallet_segwit_address_get' : IDL.Func([IDL.Bool], [Result_13], []),
  });
};
export const init = ({ IDL }) => { return []; };
