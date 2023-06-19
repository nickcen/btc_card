import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

import { TxnResult, _SERVICE as Drc20Service } from './drc20_did';

import { BalanceResponse, BurnParams, InternalTokenMethods, SendParams, SendResponse, TokenServiceExtended } from '../methods';
import { Metadata } from '../ext/interfaces';

type BaseDrc20Service = TokenServiceExtended<Drc20Service>;

const getMetadata = async (actor: ActorSubclass<BaseDrc20Service>): Promise<Metadata> => {
  const metadataResult = await actor._drc20_metadata();
  const fee = await actor._drc20_fee();
  const decimals = await actor._drc20_decimals();
  return {
    fungible: {
      symbol: 'DRC20',
      decimals: decimals,
      name: metadataResult[0].name,
      fee: Number(fee),
    },
  };
};

const send = async (actor: ActorSubclass<BaseDrc20Service>, { to, amount }: SendParams, proxy: boolean): Promise<SendResponse> => {
  const transferResult = await (proxy ? actor.drc20_transfer(to, amount, [], [], []): actor._drc20_transfer(to, amount, [], [], []) ) ;

  if ('ok' in transferResult) return { transactionId: transferResult.ok.toString() };

  throw new Error(Object.keys(transferResult.err)[0]);
};

const getBalance = async (actor: ActorSubclass<BaseDrc20Service>, user: Principal): Promise<BalanceResponse> => {
  const decimals = await getDecimals(actor);
  const value = (await actor._drc20_balanceOf(user.toText())).toString();
  return { value, decimals };
};

const burnXTC = async (_actor: ActorSubclass<BaseDrc20Service>, _params: BurnParams) => {
  throw new Error('BURN NOT SUPPORTED');
};

const getDecimals = async (actor: ActorSubclass<BaseDrc20Service>): Promise<number> => {
  const result = await actor._drc20_decimals();
  return result;
};

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
  getDecimals,
} as InternalTokenMethods;
