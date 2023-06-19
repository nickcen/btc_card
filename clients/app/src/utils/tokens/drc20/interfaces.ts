import type { Principal } from '@dfinity/principal';
import { DRC20 } from './drc20_did'

export interface Metadata {
  'content' : string, 
  'name' : string
}
export type Result = { Ok: bigint } | { Err: TxError };
export interface TokenInfo {
  holderNumber: bigint;
  deployTime: bigint;
  metadata: Metadata;
  historySize: bigint;
  cycles: bigint;
  feeTo: Principal;
}
export type TxError =
  | { InsufficientAllowance: null }
  | { InsufficientBalance: null }
  | { ErrorOperationStyle: null }
  | { Unauthorized: null }
  | { LedgerTrap: null }
  | { ErrorTo: null }
  | { Other: null }
  | { BlockUsed: null }
  | { AmountTooSmall: null };

