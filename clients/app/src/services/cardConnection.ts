import { ActorSubclass, HttpAgent, SignIdentity } from '@dfinity/agent';
import {  _SERVICE as ctrlService } from 'srcPath/../../idls/btc_wallet';
import { idlFactory as ctrlIdl } from 'srcPath/../../idls/btc_wallet.idl';
import { BaseConnection, _createActor } from './baseConnection';

const aaCid = process.env.AACID

console.log('aaCid=====', aaCid)

export class CardConnection extends BaseConnection<ctrlService> {
  constructor(
    public delegationIdentity: SignIdentity,
    public canisterId: string,
    public actor: ActorSubclass<ctrlService>,
    public agent: HttpAgent,
  ) {
    super(delegationIdentity, canisterId, ctrlIdl, actor, agent);
  }

  static async create(
    delegationIdentity: SignIdentity,
    canisterId: string,
  ): Promise<CardConnection | void> {
    console.log('ctrl canisterId', canisterId);
    const { actor, agent } = await _createActor<ctrlService>(ctrlIdl, canisterId, delegationIdentity);
    return new CardConnection( delegationIdentity, canisterId!, actor, agent);
  }

  // async icpGetAccounts(): Promise<AccountDetail[]> {
  //   return await this.actor.icpGetAccounts();
  // }  

  // async icpSend(sendParams: SendArgs): Promise<bigint | string | undefined> {
  //   try {
  //     const result = await this.actor.icpSend(sendParams);
  //     console.log('icpSend result', result);
  //     if (hasOwnProperty(result, 'Ok')) {
  //       return result['Ok'];
  //     } else {
  //       return result['Err'];
  //     }
  //   } catch (err) {
  //     console.log('err', err);
  //     throw err;
  //   }
  // }

  // async ego_is_owner(): Promise<boolean> {
  //   try {
  //     const result = await this.actor.ego_is_owner();
  //     console.log('activate result', result);
  //     if(hasOwnProperty(result, 'Ok')) {
  //       return result['Ok'];
  //     }else {
  //       return false
  //     }
  //   } catch (err) {
  //     console.log('err', err);
  //     return await this.ego_is_owner()
  //   }
  // }
  // async wallet_eoa_address_get(): Promise<string | void> {
  //   try {
  //     const result = await this.actor.wallet_eoa_address_get();
  //     console.log('activate result', result);
  //     if (hasOwnProperty(result, 'Ok')) {
  //       return result['Ok'];
  //     } 
  //   } catch (err) {
  //     console.log('err', err);
  //   }
  // }
}
