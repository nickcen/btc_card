
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { Chain, fetchBalance, fetchToken, readContract } from '@wagmi/core';
import { BigNumber } from 'ethers';
import { ok, err, Result } from 'neverthrow';
import { HttpService } from 'srcPath/services/ord';
import { getTokenIds, ordService } from '.';
import { getTokenActor } from './registries/token_registry/token_registry';

const IC_HOST = process.env.NODE_ENV === 'development' ? 'https://icp-api.io' :'https://icp-api.io';
const DEFAULT_AGENT = new HttpAgent({ host: IC_HOST });

export type UserToken = {
  balance: string;
  balanceToString: string;
  balanceFormatString: string;
  balance_usd: string;
  totalSupply: number;
  name: string;
  weight?: number;
  standard: string;
  symbol: string;
  icon: string;
  desc?: string;
  contractAddress: string;
  digits: number;
  serviceCharge: number;
  version?: string;
  disabled: boolean;
  custom?: boolean;
  blockChain?: string;
  price?: string;
};
export interface ICSCANNFTDetail {
  canisterId: string;
  imageUrl: string;
  inListing?: boolean;
  isIframe?: boolean;
  latestPrice?: number;
  listingPrice?: number;
  marketUrl?: string;
  standard?: string;
  name: string;
  owner?: string;
  tokenIdentifier?: string;
  token_id: number;
  videoUrl?: string;
}


export type CollectionsType = {
  contractAddress: string;
  name: string;
  description?: string;
  blockChain?: string;
  icon?: string;
  standard?: string;
  weight?: number;
  total?: number;
  disabled?: boolean;
  custom?: boolean;
  isIframe?: boolean;
  minSize: number;
  children?: ICSCANNFTDetail[];
};


export const getAddressFormat = (standard: any) => {
  switch (standard) {
    case 'ICP':
      return { principal: true, accountId: true };
    case 'EXT':
      return { principal: true, accountId: true };
    case 'WICP':
      return { principal: true, accountId: false };
    case 'XTC':
      return { principal: true, accountId: false };
    case 'IS20':
      return { principal: true, accountId: false };
    case 'DIP20':
      return { principal: true, accountId: false };
    case 'DRC20':
      return { principal: true, accountId: false };
  }
  return { principal: true, accountId: false };
};


// TODO: enum Error
export const getAllUserTokens = async ({ address, getTokens, network }: {address: string; getTokens: UserToken[]; network: Chain}): Promise<Result<Array<Result<UserToken, Error>>, Error>> => {
  try {
    console.log('getTokens1111', getTokens);
    const queryTokens = getTokens;
    const results = await Promise.all(
      queryTokens.map(async (token: any) => {
        const result = await getTokenDetails({ token, address, network });
        return result.map(tokenDetails => {
          return {
            ...token,
            ...tokenDetails,
          };
        });
      }),
    );
    console.log('getAllUserTokens', results);
    return ok(results);
  } catch (e) {
    return err(e as Error);
  }
};



const getTokenDetails = async ({
  token,
  address,
  network,
}: {
  token: UserToken;
  address: string;
  network?: Chain;
}): Promise<Result<{ balance: string }, Error>> => {
  try {
    if (token.blockChain === 'IC') {
      console.log('getTokenDetails', address, token)
      const tokenActor = await getTokenActor({
        canisterId: token.contractAddress,
        agent: DEFAULT_AGENT,
        standard: token.standard,
      });
      const result = await tokenActor.getBalance(Principal.from(address));
      console.log('getTokenDetails result', address, token)
      if (result.value === 'Error') {
        return ok({ balance: '0' });
      }
      return ok({ balance: result.value });
    } else if(token.blockChain === 'bitcoin') {
      const result = await ordService.getAddressBalance(address)
      return ok({ balance: (Number(result.amount) * Math.pow(10, 9)).toFixed(0) });
    } else { 
      let result;
      try {
        result = await fetchBalance({
          address: address as `0x${string}`,
          token: network?.nativeCurrency.symbol === token.symbol ? undefined : (token.contractAddress as `0x${string}`),
        });
        const tokenInfo = await fetchToken({
          address: token.contractAddress as `0x${string}`,
        });
        console.log('tokenInfo', tokenInfo, result, address, token.contractAddress);
      } catch (err) {
        console.log('err', err);
      }
      if (result) {
        return ok({ balance: result?.value.toString() });
      } else {
        return ok({ balance: '0' });
      }
    }
    
  } catch (e) {
    // TODO: figure out why origyn errors?
    return ok({ balance: '0' });
  }
};



export const getAllUserNFTs = async ({
  address,
  collectionClass,
  network,
}: {
  address: string;
  collectionClass: CollectionsType[];
  network?: Chain,
}): Promise<Result<{ userCollections: CollectionsType[] }, Error>> => {
  try {
    console.log('getAllUserNFTs====', address, collectionClass);
    const queryTokens = collectionClass;
    const results = await Promise.all(
      queryTokens.map(async collectionClass => {
        const result = await getNftDetails({ address, collectionClass, network });
        return result.map(tokenDetails => {
          console.log('tokenDetail', tokenDetails);
          let isVideo = false;
          const formatDetails = tokenDetails.map(detail => ({
            ...detail,
            isIframe: !!collectionClass.isIframe,
          }));
          return {
            ...collectionClass,
            isIframe: !!collectionClass.isIframe,
            isVideo: isVideo,
            total: formatDetails.length,
            children: [...formatDetails],
          };
        });
      }),
    );
    const userCollections = results.reduce<any>(
      (acc, result) => (result.isOk() ? acc.concat(result.value) : acc.concat([{ ...result.error.value, err: result.error.err }])),
      [],
    );
    console.log('getAllUserNFTs result', results);
    if (userCollections.length > 0) {
      return ok({ userCollections: userCollections ?? [] });
    } else {
      return ok({
        userCollections: collectionClass.map(o => ({
          ...o,
          total: 0,
          children: [],
        })),
      });
    }
  } catch (e) {
    return err(e as Error);
  }
};

const getNftDetails = async ({
  address,
  collectionClass,
  network,
}: {
  collectionClass: CollectionsType;
  address: string;
  network?: Chain;
}): Promise<Result<ICSCANNFTDetail[], { value: CollectionsType; err: Error }>> => {
  try {
    return ok([]);
  } catch (e) {
    console.log('getUserTokens error', e);
    return err({
      value: { ...collectionClass, total: 0 },
      err: e as Error,
    });
  }
};