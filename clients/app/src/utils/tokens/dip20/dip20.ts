import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

import Dip20Service from './interfaces';
import { Metadata } from '../ext/interfaces';
import {
  BalanceResponse,
  BurnParams,
  getDecimalsFromMetadata,
  InternalTokenMethods,
  SendParams,
  SendResponse,
  TokenServiceExtended,
} from '../methods';

type BaseDip20Service = TokenServiceExtended<Dip20Service>;

const getMetadata = async (actor: ActorSubclass<BaseDip20Service>): Promise<Metadata> => {
  const metadataResult = await actor._getMetadata();
  return {
    fungible: {
      symbol: metadataResult.symbol,
      decimals: metadataResult.decimals,
      name: metadataResult.name,
      fee: Number(metadataResult.fee),
    },
  };
};

const send = async (actor: ActorSubclass<BaseDip20Service>, { to, amount, opts }: SendParams, proxy: boolean): Promise<SendResponse> => {
  const transferResult = await (proxy ? actor.transfer(Principal.fromText(to), amount): actor._transfer(Principal.fromText(to), amount)) ;

  if ('Ok' in transferResult) return { transactionId: transferResult.Ok.toString() };

  throw new Error(Object.keys(transferResult.Err)[0]);
};

const getBalance = async (actor: ActorSubclass<BaseDip20Service>, user: Principal): Promise<BalanceResponse> => {
  const decimals = await getDecimals(actor);
  const value = (await actor._balanceOf(user)).toString();
  return { value, decimals };
};

const burnXTC = async (_actor: ActorSubclass<BaseDip20Service>, _params: BurnParams) => {
  throw new Error('BURN NOT SUPPORTED');
};

const getDecimals = async (actor: ActorSubclass<BaseDip20Service>) => getDecimalsFromMetadata(await getMetadata(actor));

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
  getDecimals,
} as InternalTokenMethods;
