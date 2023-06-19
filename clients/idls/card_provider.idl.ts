export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : IDL.Text });
  const ChainType = IDL.Variant({
    'IC' : IDL.Null,
    'BTC' : IDL.Null,
    'ETH' : IDL.Null,
  });
  const MintType = IDL.Variant({
    'ACTIVATED' : IDL.Null,
    'CREATED' : IDL.Null,
  });
  const ControllerMainCreateRequest = IDL.Record({
    'chain' : ChainType,
    'name' : IDL.Text,
    'sub_domain' : IDL.Text,
    'canister_app_name' : IDL.Text,
    'mint_type' : MintType,
  });
  const Controller = IDL.Record({
    'id' : IDL.Principal,
    'chain' : ChainType,
    'name' : IDL.Text,
    'sub_domain' : IDL.Text,
    'mint_type' : MintType,
  });
  const ControllerMainUpgradeRequest = IDL.Record({
    'canister_id' : IDL.Principal,
  });
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
  const Result_1 = IDL.Variant({ 'Ok' : AppInfo, 'Err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_3 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal))),
    'Err' : IDL.Text,
  });
  const CycleRecord = IDL.Record({ 'ts' : IDL.Nat64, 'balance' : IDL.Nat });
  const Result_4 = IDL.Variant({
    'Ok' : IDL.Vec(CycleRecord),
    'Err' : IDL.Text,
  });
  const CycleInfo = IDL.Record({
    'records' : IDL.Vec(CycleRecord),
    'estimate_remaining' : IDL.Nat64,
  });
  const Result_5 = IDL.Variant({ 'Ok' : CycleInfo, 'Err' : IDL.Text });
  const Result_6 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const LogEntry = IDL.Record({
    'ts' : IDL.Nat64,
    'msg' : IDL.Text,
    'kind' : IDL.Text,
  });
  const Result_7 = IDL.Variant({ 'Ok' : IDL.Vec(LogEntry), 'Err' : IDL.Text });
  const Result_8 = IDL.Variant({
    'Ok' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text))),
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'balance_get' : IDL.Func([], [Result], ['query']),
    'controller_main_create' : IDL.Func(
        [ControllerMainCreateRequest],
        [Controller],
        [],
      ),
    'controller_main_get' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(Controller)],
        ['query'],
      ),
    'controller_main_list' : IDL.Func([], [IDL.Vec(Controller)], ['query']),
    'controller_main_upgrade' : IDL.Func(
        [ControllerMainUpgradeRequest],
        [],
        [],
      ),
    'ego_app_info_get' : IDL.Func([], [Result_1], ['query']),
    'ego_app_info_update' : IDL.Func(
        [IDL.Opt(IDL.Principal), IDL.Text, Version],
        [],
        [],
      ),
    'ego_app_version_check' : IDL.Func([], [Result_1], []),
    'ego_canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result_2], []),
    'ego_canister_delete' : IDL.Func([], [Result_2], []),
    'ego_canister_list' : IDL.Func([], [Result_3], []),
    'ego_canister_remove' : IDL.Func([IDL.Text, IDL.Principal], [Result_2], []),
    'ego_canister_track' : IDL.Func([], [Result_2], []),
    'ego_canister_untrack' : IDL.Func([], [Result_2], []),
    'ego_canister_upgrade' : IDL.Func([], [Result_2], []),
    'ego_controller_add' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_controller_remove' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_controller_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_2], []),
    'ego_cycle_check' : IDL.Func([], [Result_2], []),
    'ego_cycle_estimate_set' : IDL.Func([IDL.Nat64], [Result_2], []),
    'ego_cycle_history' : IDL.Func([], [Result_4], []),
    'ego_cycle_info' : IDL.Func([], [Result_5], []),
    'ego_cycle_recharge' : IDL.Func([IDL.Nat], [Result_2], []),
    'ego_cycle_threshold_get' : IDL.Func([], [Result], []),
    'ego_is_op' : IDL.Func([], [Result_6], ['query']),
    'ego_is_owner' : IDL.Func([], [Result_6], ['query']),
    'ego_is_user' : IDL.Func([], [Result_6], ['query']),
    'ego_log_list' : IDL.Func([IDL.Nat64], [Result_7], ['query']),
    'ego_op_add' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_op_list' : IDL.Func([], [Result_8], []),
    'ego_op_remove' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_owner_add' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_owner_add_with_name' : IDL.Func(
        [IDL.Text, IDL.Principal],
        [Result_2],
        [],
      ),
    'ego_owner_list' : IDL.Func([], [Result_8], []),
    'ego_owner_remove' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_owner_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_2], []),
    'ego_runtime_cycle_threshold_get' : IDL.Func([], [Result], []),
    'ego_user_add' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_user_list' : IDL.Func([], [Result_8], []),
    'ego_user_remove' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_user_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_2], []),
  });
};
export const init = ({ IDL }) => { return []; };
