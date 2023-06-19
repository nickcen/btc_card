export const idlFactory = ({ IDL }) => {
  const ActiveRequest = IDL.Record({
    'email' : IDL.Text,
    'card_code' : IDL.Text,
    'active_code' : IDL.Text,
  });
  const ContractStatus = IDL.Variant({
    'NEW' : IDL.Null,
    'ACTIVATED' : IDL.Null,
    'DEPLOYING' : IDL.Null,
  });
  const Contract = IDL.Record({
    'status' : ContractStatus,
    'card_number' : IDL.Text,
    'email' : IDL.Opt(IDL.Text),
    'user_address' : IDL.Opt(IDL.Principal),
    'card_code' : IDL.Text,
    'active_code' : IDL.Text,
    'contract_address' : IDL.Principal,
    'eoa_address' : IDL.Opt(IDL.Text),
  });
  const SystemError = IDL.Record({ 'msg' : IDL.Text, 'code' : IDL.Nat16 });
  const Result = IDL.Variant({ 'Ok' : Contract, 'Err' : SystemError });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : SystemError });
  const Result_3 = IDL.Variant({
    'Ok' : IDL.Opt(Contract),
    'Err' : SystemError,
  });
  const Result_4 = IDL.Variant({
    'Ok' : IDL.Vec(Contract),
    'Err' : SystemError,
  });
  const PremintRequest = IDL.Record({
    'card_number' : IDL.Text,
    'card_code' : IDL.Text,
    'active_code' : IDL.Text,
  });
  const ChainType = IDL.Variant({
    'IC' : IDL.Null,
    'BTC' : IDL.Null,
    'ETH' : IDL.Null,
  });
  const MintType = IDL.Variant({
    'ACTIVATED' : IDL.Null,
    'CREATED' : IDL.Null,
  });
  const ControllerInfo = IDL.Record({
    'status' : IDL.Bool,
    'chain' : ChainType,
    'name' : IDL.Text,
    'sub_domain' : IDL.Text,
    'canister_app_name' : IDL.Text,
    'mint_type' : MintType,
    'remain_cycle' : IDL.Nat64,
    'airdrop_canister' : IDL.Opt(IDL.Principal),
    'amount' : IDL.Nat16,
  });
  const DeActiveRequest = IDL.Record({ 'card_code' : IDL.Text });
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
  const Result_5 = IDL.Variant({ 'Ok' : AppInfo, 'Err' : IDL.Text });
  const Result_6 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_7 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal))),
    'Err' : IDL.Text,
  });
  const CycleRecord = IDL.Record({ 'ts' : IDL.Nat64, 'balance' : IDL.Nat });
  const Result_8 = IDL.Variant({
    'Ok' : IDL.Vec(CycleRecord),
    'Err' : IDL.Text,
  });
  const CycleInfo = IDL.Record({
    'records' : IDL.Vec(CycleRecord),
    'estimate_remaining' : IDL.Nat64,
  });
  const Result_9 = IDL.Variant({ 'Ok' : CycleInfo, 'Err' : IDL.Text });
  const Result_10 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const LogEntry = IDL.Record({
    'ts' : IDL.Nat64,
    'msg' : IDL.Text,
    'kind' : IDL.Text,
  });
  const Result_11 = IDL.Variant({ 'Ok' : IDL.Vec(LogEntry), 'Err' : IDL.Text });
  const Result_12 = IDL.Variant({
    'Ok' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text))),
    'Err' : IDL.Text,
  });
  const GetContractResponse = IDL.Record({
    'status' : ContractStatus,
    'email' : IDL.Opt(IDL.Text),
    'card_code' : IDL.Text,
    'contract_address' : IDL.Principal,
    'eoa_address' : IDL.Opt(IDL.Text),
  });
  const Result_13 = IDL.Variant({
    'Ok' : GetContractResponse,
    'Err' : SystemError,
  });
  return IDL.Service({
    'activate' : IDL.Func([ActiveRequest], [Result], []),
    'balance_get' : IDL.Func([], [Result_1], ['query']),
    'cards_export' : IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
    'cards_import' : IDL.Func([IDL.Vec(IDL.Nat8)], [], []),
    'contract_change_active_code' : IDL.Func(
        [IDL.Text, IDL.Text],
        [Result_2],
        [],
      ),
    'contract_change_code' : IDL.Func([IDL.Text, IDL.Text], [Result_3], []),
    'contract_list' : IDL.Func([ContractStatus], [Result_4], []),
    'contract_list_all' : IDL.Func([], [Result_4], []),
    'contract_premint' : IDL.Func([PremintRequest], [Result_2], []),
    'controller_get' : IDL.Func([], [ControllerInfo], []),
    'controller_init' : IDL.Func(
        [IDL.Text, ChainType, IDL.Text, MintType],
        [],
        [],
      ),
    'controller_status_toggle' : IDL.Func([], [], []),
    'deactivate' : IDL.Func([DeActiveRequest], [Result], []),
    'ego_app_info_get' : IDL.Func([], [Result_5], ['query']),
    'ego_app_info_update' : IDL.Func(
        [IDL.Opt(IDL.Principal), IDL.Text, Version],
        [],
        [],
      ),
    'ego_app_version_check' : IDL.Func([], [Result_5], []),
    'ego_canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result_6], []),
    'ego_canister_delete' : IDL.Func([], [Result_6], []),
    'ego_canister_list' : IDL.Func([], [Result_7], []),
    'ego_canister_remove' : IDL.Func([IDL.Text, IDL.Principal], [Result_6], []),
    'ego_canister_track' : IDL.Func([], [Result_6], []),
    'ego_canister_untrack' : IDL.Func([], [Result_6], []),
    'ego_canister_upgrade' : IDL.Func([], [Result_6], []),
    'ego_controller_add' : IDL.Func([IDL.Principal], [Result_6], []),
    'ego_controller_remove' : IDL.Func([IDL.Principal], [Result_6], []),
    'ego_controller_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_6], []),
    'ego_cycle_check' : IDL.Func([], [Result_6], []),
    'ego_cycle_estimate_set' : IDL.Func([IDL.Nat64], [Result_6], []),
    'ego_cycle_history' : IDL.Func([], [Result_8], []),
    'ego_cycle_info' : IDL.Func([], [Result_9], []),
    'ego_cycle_recharge' : IDL.Func([IDL.Nat], [Result_6], []),
    'ego_cycle_threshold_get' : IDL.Func([], [Result_1], []),
    'ego_is_op' : IDL.Func([], [Result_10], ['query']),
    'ego_is_owner' : IDL.Func([], [Result_10], ['query']),
    'ego_is_user' : IDL.Func([], [Result_10], ['query']),
    'ego_log_list' : IDL.Func([IDL.Nat64], [Result_11], ['query']),
    'ego_op_add' : IDL.Func([IDL.Principal], [Result_6], []),
    'ego_op_list' : IDL.Func([], [Result_12], []),
    'ego_op_remove' : IDL.Func([IDL.Principal], [Result_6], []),
    'ego_owner_add' : IDL.Func([IDL.Principal], [Result_6], []),
    'ego_owner_add_with_name' : IDL.Func(
        [IDL.Text, IDL.Principal],
        [Result_6],
        [],
      ),
    'ego_owner_list' : IDL.Func([], [Result_12], []),
    'ego_owner_remove' : IDL.Func([IDL.Principal], [Result_6], []),
    'ego_owner_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_6], []),
    'ego_runtime_cycle_threshold_get' : IDL.Func([], [Result_1], []),
    'ego_user_add' : IDL.Func([IDL.Principal], [Result_6], []),
    'ego_user_list' : IDL.Func([], [Result_12], []),
    'ego_user_remove' : IDL.Func([IDL.Principal], [Result_6], []),
    'ego_user_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_6], []),
    'fix_contract_status' : IDL.Func([], [Result_2], []),
    'get_contract' : IDL.Func([IDL.Text], [Result_13], ['query']),
    'get_my_contracts' : IDL.Func([], [IDL.Vec(Contract)], ['query']),
    'mint_exist' : IDL.Func([DeActiveRequest], [Result_2], []),
  });
};
export const init = ({ IDL }) => { return []; };
