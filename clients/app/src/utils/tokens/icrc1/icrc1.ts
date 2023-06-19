import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

import { TransferArgs, _SERVICE as ICRCService } from './icrc1_did';

import { BalanceResponse, BurnParams, InternalTokenMethods, SendParams, SendResponse, TokenServiceExtended } from '../methods';
import { BaseMethodsExtendedActor } from '../../dab_utils/actorFactory';
import { Metadata } from '../ext/interfaces';

type BaseICRCService = TokenServiceExtended<ICRCService>;

const getMetadata = async (actor: ActorSubclass<BaseICRCService>): Promise<Metadata> => {
  const metadataResult: any = await actor._icrc1_metadata();
  console.log('metadataResult=====', metadataResult);
  console.log('metadataResult=====', metadataResult[0]);
  console.log('metadataResult=====', metadataResult[0][1]);
  const reuslt = {
    decimals: metadataResult.find((item: (string | string[])[]) => item[0].indexOf('decimals') > -1)[1].Nat,
    name: metadataResult.find((item: (string | string[])[]) => item[0].indexOf('name') > -1)[1].Text,
    symbol: metadataResult.find((item: (string | string[])[]) => item[0].indexOf('symbol') > -1)[1].Text,
    fee: metadataResult.find((item: (string | string[])[]) => item[0].indexOf('fee') > -1)[1].Nat,
  };
  console.log('Result', reuslt);
  return {
    fungible: {
      ...reuslt,
      decimals: Number(reuslt.decimals),
      fee: Number(reuslt.fee),
    },
  };
};

const send = async (actor: ActorSubclass<BaseICRCService>, { to, amount, opts }: SendParams,  proxy: boolean): Promise<SendResponse> => {
  const fee = await (proxy ? actor.icrc1_fee() : actor._icrc1_fee()) ;
  // console.log(fee)
  const params: TransferArgs = {
    to: {
      owner: Principal.fromText(to),
      subaccount: [],
    },
    fee: [fee],
    memo: opts.memo ? [opts.memo] : [],
    from_subaccount: opts.subaccount ? [opts.subaccount] : [],
    created_at_time: opts.created_at_time ? [opts.created_at_time] : [],
    amount: amount,
  };
  console.log('send===', params);
  const transferResult = await (proxy ? actor.icrc1_transfer(params) : actor._icrc1_transfer(params) ) ;

  if ('Ok' in transferResult) return { transactionId: transferResult.Ok.toString() };

  throw new Error(Object.keys(transferResult.Err)[0]);
};

const getBalance = async (actor: ActorSubclass<BaseICRCService>, user: Principal): Promise<BalanceResponse> => {
  const decimals = await getDecimals(actor);
  const value = (
    await actor._icrc1_balance_of({
      owner: user,
      subaccount: [],
    })
  ).toString();
  return { value, decimals };
};

const burnXTC = async (_actor: ActorSubclass<BaseICRCService>, _params: BurnParams) => {
  throw new Error('BURN NOT SUPPORTED');
};

const getDecimals = async (actor: ActorSubclass<BaseICRCService>): Promise<number> => {
  const result = await actor._icrc1_decimals();
  return result;
};

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
  getDecimals,
} as InternalTokenMethods;
