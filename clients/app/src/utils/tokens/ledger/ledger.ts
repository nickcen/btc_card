import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

import LedgerService from './interfaces';
import { getBalance as ledgerGetBalance } from 'srcPath/services/ledgerConnection';
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
import { getAccountId } from '../../dab_utils/account';
import { validatePrincipalId } from '../../dab_utils/validations';
import { arrayOfNumberToUint8Array, principalToAccountIdentifier } from 'srcPath/utils/converter';
import { SubAccount } from 'srcPath/candid/ledger';

type BaseLedgerService = TokenServiceExtended<LedgerService>;

const DECIMALS = 8;

const NET_ID = {
  blockchain: 'Internet Computer',
  network: '00000000000000020101',
};
const ROSETTA_URL = 'https://rosetta-api.internetcomputer.org';

const getMetadata = async (_actor: ActorSubclass<BaseLedgerService>): Promise<Metadata> => {
  return {
    fungible: {
      symbol: 'ICP',
      decimals: DECIMALS,
      name: 'ICP',
    },
  };
};

const send = async (actor: ActorSubclass<BaseLedgerService>, { to, amount, opts }: SendParams): Promise<SendResponse> => {
  const defaultArgs = {
    fee: BigInt(10000),
    memo: BigInt(0),
  };
  const response = await actor._send_dfx({
    to: validatePrincipalId(to) ? getAccountId(Principal.fromText(to)) : to,
    fee: { e8s: opts?.fee || defaultArgs.fee },
    amount: { e8s: amount },
    memo: opts?.memo ? BigInt(opts.memo) : defaultArgs.memo,
    from_subaccount: [], // For now, using default subaccount to handle ICP
    created_at_time: [],
  });

  return { height: await response.toString() };
};

const getBalance = async (actor: ActorSubclass<BaseLedgerService>, user: Principal, subaccount?: SubAccount): Promise<BalanceResponse> => {
  const account = principalToAccountIdentifier(user, subaccount ? arrayOfNumberToUint8Array(subaccount) : undefined);
  const decimals = await getDecimals(actor);
  const response = await fetch(`${ROSETTA_URL}/account/balance`, {
    method: 'POST',
    body: JSON.stringify({
      network_identifier: NET_ID,
      account_identifier: {
        address: account,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
  });
  if (!response.ok) {
    return { value: 'Error', decimals, error: response.statusText };
  }
  const { balances } = await response.json();
  const [{ value, currency }] = balances;

  return { value, decimals: currency.decimals };
};

const burnXTC = async (_actor: ActorSubclass<BaseLedgerService>, _params: BurnParams) => {
  throw new Error('BURN NOT SUPPORTED');
};

const getDecimals = async (actor: ActorSubclass<BaseLedgerService>) => getDecimalsFromMetadata(await getMetadata(actor));

export default {
  send,
  getMetadata,
  getBalance: process.env.II_ENV === 'development' ? ledgerGetBalance : getBalance,
  burnXTC,
  getDecimals,
} as InternalTokenMethods;
