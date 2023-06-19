import { ActorSubclass, Actor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

import ExtService, { Metadata } from './interfaces';
import { BaseMethodsExtendedActor } from '../../dab_utils/actorFactory';
import {
  BalanceResponse,
  BurnParams,
  getDecimalsFromMetadata,
  InternalTokenMethods,
  SendParams,
  SendResponse,
  TokenServiceExtended,
} from '../methods';
import { AddressType, getAddressType } from 'srcPath/utils/converter';

type BaseExtService = TokenServiceExtended<ExtService>;

const getMetadata = async (actor: ActorSubclass<BaseExtService>): Promise<Metadata> => {
  actor._balance;
  const token = Actor.canisterIdOf(actor).toText();

  const extensions = await actor._extensions();
  console.log('extensions', extensions);
  if (!extensions.includes('@ext/common')) throw new Error('The provided canister does not implement commont extension');
  const metadataResult = await actor._metadata(token);

  if ('ok' in metadataResult) return metadataResult.ok;

  throw new Error(Object.keys(metadataResult.err)[0]);
};

const send = async (actor: ActorSubclass<BaseExtService>, { to, from, amount, opts }: SendParams, proxy: boolean): Promise<SendResponse> => {
  const stringTypeTo = getAddressType(to);
  const stringTypeFrom = getAddressType(from);
  const token = Actor.canisterIdOf(actor).toText();
  const data = {
    to: stringTypeTo === AddressType.PRINCIPAL ? { principal: Principal.fromText(to) } : { address: to },
    from: stringTypeFrom === AddressType.PRINCIPAL ? { principal: Principal.from(from) } : { address: from },
    amount: BigInt(amount),
    token,
    memo: opts.memo ?? new Array(32).fill(0),
    notify: false,
    subaccount: opts.subaccount ? [opts.subaccount] : [],
    fee: BigInt(0),
  };
  console.log('ssss', data);
  const transferResult = await (proxy ? actor.transfer(data) : actor._transfer(data));

  if ('ok' in transferResult) return { amount: transferResult.ok.toString() };

  throw new Error(Object.keys(transferResult.err)[0]);
};

const getBalance = async (actor: ActorSubclass<BaseExtService>, user: Principal): Promise<BalanceResponse> => {
  const token = Actor.canisterIdOf(actor).toText();

  const balanceResult = await actor._balance({
    token,
    user: { principal: user },
  });

  const decimals = await getDecimals(actor);

  if ('ok' in balanceResult) return { value: balanceResult.ok.toString(), decimals };

  throw new Error(Object.keys(balanceResult.err)[0]);
};

const burnXTC = async (_actor: ActorSubclass<BaseExtService>, _params: BurnParams) => {
  throw new Error('BURN NOT SUPPORTED');
};

const getDecimals = async (actor: ActorSubclass<BaseExtService>) => getDecimalsFromMetadata(await getMetadata(actor));

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
  getDecimals,
} as InternalTokenMethods;
