/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Principal } from '@dfinity/principal';
import { BaseConnection, CreateActorResult, executeWithLogging, _createActor } from './baseConnection';
import { idlFactory as ledger_idl } from 'srcPath/candid/ledger.idl';
import {
  _SERVICE as LEDGER_SERVICE,
  AccountIdentifier,
  Memo,
  SendArgs,
  SubAccount,
  TimeStamp,
  TransferArgs,
  AccountIdentifierNew,
  TransferError,
  BlockIndex,
} from 'srcPath/candid/ledger';
import { ActorSubclass, HttpAgent, SignIdentity } from '@dfinity/agent';
import { DelegationIdentity } from '@dfinity/identity';
import { accountIdentifierToBytes, arrayOfNumberToUint8Array, fromSubAccountId, principalToAccountIdentifier } from 'srcPath/utils/converter';
import { toHexString } from '@dfinity/candid/lib/cjs/utils/buffer';
import { BalanceResponse } from 'srcPath/utils/tokens/interfaces/token';
import { getAccountId } from 'srcPath/utils/dab_utils/account';

const canisterId: string = process.env.LEDGER_CANISTER_ID!;
export const canisterIdPrincipal: Principal = Principal.fromText(canisterId);

interface SendOpts {
  fee?: bigint;
  memo?: Memo;
  from_subaccount?: number;
  created_at_time?: Date;
}

export interface TransactionResponse {
  blockHeight: bigint;
  sendArgs: SendArgs;
}

export class LedgerConnection extends BaseConnection<LEDGER_SERVICE> {
  protected constructor(
    public identity: SignIdentity,
    public delegationIdentity: DelegationIdentity,
    public actor?: ActorSubclass<LEDGER_SERVICE>,
    public agent?: HttpAgent,
  ) {
    super(delegationIdentity, canisterId, ledger_idl, actor, agent);
  }

  /**
   * create connection
   * @function createConnection
   * @return {LedgerConnection}
   */
  static createConnection(
    identity: SignIdentity,
    delegationIdentity: DelegationIdentity,
    actor?: ActorSubclass<LEDGER_SERVICE>,
    agent?: HttpAgent,
  ): LedgerConnection {
    return new LedgerConnection(identity, delegationIdentity, actor, agent);
  }

  /**
   * create Actor with DelegationIdentity
   * @function {function name}
   * @return {type} {description}
   */
  static async createActor(delegationIdentity: DelegationIdentity): Promise<CreateActorResult<LEDGER_SERVICE>> {
    const actor = await _createActor<LEDGER_SERVICE>(ledger_idl, canisterId, delegationIdentity);
    return actor;
  }

  static async createConnectionWithII(identity: SignIdentity, delegationIdentity: DelegationIdentity): Promise<LedgerConnection> {
    const actorResult = await LedgerConnection.createActor(delegationIdentity);
    return LedgerConnection.createConnection(identity, delegationIdentity, actorResult.actor, actorResult.agent);
  }

  static async actorGetBalance(actor: ActorSubclass<LEDGER_SERVICE>, account: AccountIdentifier): Promise<bigint> {
    const response = await executeWithLogging(() => actor.account_balance_dfx({ account }));
    return response.e8s;
  }

  static async actorSend(
    actor: ActorSubclass<LEDGER_SERVICE>,
    {
      to,
      amount,
      sendOpts,
    }: {
      to: AccountIdentifier;
      amount: bigint;
      sendOpts?: SendOpts;
    },
  ): Promise<TransactionResponse> {
    const sendArgs = sendArgsBuilder({ to, amount, sendOpts });
    const response = await executeWithLogging(() => {
      return actor.send_dfx(sendArgs);
    });
    return { blockHeight: response, sendArgs };
  }

  static async actorTransfer(
    actor: ActorSubclass<LEDGER_SERVICE>,
    {
      to,
      amount,
      sendOpts,
    }: {
      to: AccountIdentifier;
      amount: bigint;
      sendOpts?: SendOpts;
    },
  ): Promise<TransactionResponse> {
    try {
      const sendArgs = transferArgsBuilder({ to, amount, sendOpts });
      const response = await executeWithLogging(() => {
        return actor.transfer(sendArgs);
      });
      // { 'Ok' : BlockIndex } |
      //{ 'Err' : TransferError }
      if ((response as { Err: TransferError }).Err !== undefined) {
        throw new Error(JSON.stringify((response as { Err: TransferError }).Err));
      } else {
        return {
          blockHeight: (response as { Ok: BlockIndex }).Ok,
          sendArgs: { ...sendArgs, to },
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * get NNS Actor, used internally
   * @function {function name}
   * @return {type} {description}
   */
  async getLedgerActor(): Promise<ActorSubclass<LEDGER_SERVICE>> {
    const actor = await this._getActor(canisterId, ledger_idl);
    return actor;
  }

  async getBalance(account: AccountIdentifier): Promise<bigint> {
    const actor = await this.getLedgerActor();
    const response = await executeWithLogging(() => actor.account_balance_dfx({ account }));
    return response.e8s;
  }

  async send({ to, amount, sendOpts }: { to: AccountIdentifier; amount: bigint; sendOpts?: SendOpts }): Promise<TransactionResponse> {
    const actor = await this.getLedgerActor();
    const sendArgs = sendArgsBuilder({ to, amount, sendOpts });
    const response = await executeWithLogging(() => {
      return actor.send_dfx(sendArgs);
    });
    return { blockHeight: response, sendArgs };
  }
}

// export const requestNNSDelegation = async (
//   identity: SignIdentity,
// ): Promise<DelegationIdentity> => {
//   const tenMinutesInMsec = 10 * 1000 * 60;
//   const date = new Date(Date.now() + tenMinutesInMsec);
//   return requestDelegation(identity, { canisterId, date });
// };

export function sendArgsBuilder({ to, amount, sendOpts }: { to: AccountIdentifier; amount: bigint; sendOpts?: SendOpts }): SendArgs {
  const defaultFee = BigInt(10000);
  const defaultMemo = BigInt(Math.floor(Math.random() * 10000 * 10000));
  const subAccount =
    sendOpts?.from_subaccount === undefined ? ([] as []) : (Array.from<SubAccount>([fromSubAccountId(sendOpts?.from_subaccount)]) as [SubAccount]);

  const createAtTime =
    sendOpts?.created_at_time === undefined
      ? ([] as [])
      : (Array.from<TimeStamp>([
          {
            timestamp_nanos: BigInt(sendOpts?.created_at_time?.getTime() * 1000000),
          },
        ]) as [TimeStamp]);

  return {
    to: to,
    fee: {
      e8s: sendOpts?.fee ?? defaultFee,
    },
    amount: { e8s: amount },
    memo: sendOpts?.memo ?? defaultMemo,
    from_subaccount: subAccount,
    created_at_time: createAtTime,
  };
}

export function transferArgsBuilder({ to, amount, sendOpts }: { to: AccountIdentifier; amount: bigint; sendOpts?: SendOpts }): TransferArgs {
  const defaultFee = BigInt(10000);
  const defaultMemo = BigInt(Math.floor(Math.random() * 10000 * 10000));
  const subAccount =
    sendOpts?.from_subaccount === undefined ? ([] as []) : (Array.from<SubAccount>([fromSubAccountId(sendOpts?.from_subaccount)]) as [SubAccount]);

  const createAtTime =
    sendOpts?.created_at_time === undefined
      ? ([] as [])
      : (Array.from<TimeStamp>([
          {
            timestamp_nanos: BigInt(sendOpts?.created_at_time?.getTime() * 1000000),
          },
        ]) as [TimeStamp]);

  return {
    to: Array.from(accountIdentifierToBytes(to)),
    fee: {
      e8s: sendOpts?.fee ?? defaultFee,
    },
    amount: { e8s: amount },
    memo: sendOpts?.memo ?? defaultMemo,
    from_subaccount: subAccount,
    created_at_time: createAtTime,
  };
}

export async function getBalance(actor: ActorSubclass<any>, user: Principal, subaccount?: SubAccount): Promise<BalanceResponse> {
  try {
    const account = principalToAccountIdentifier(user, subaccount ? arrayOfNumberToUint8Array(subaccount) : undefined);
    const bn = await LedgerConnection.actorGetBalance(actor, account);
    return {
      value: bn.toString(),
      decimals: 8,
    };
  } catch (error) {
    return {
      value: '0',
      decimals: 8,
      error: (error as Error).message,
    };
  }
}
