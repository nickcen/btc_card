import { ActorSubclass, HttpAgent } from '@dfinity/agent';
import { DelegationIdentity } from '@dfinity/identity';
import { hasOwnProperty } from 'srcPath/utils';
import {  ActiveRequest, Contract, GetContractResponse, _SERVICE as ctrlService } from 'srcPath/../../idls/card_controller';
import { idlFactory as ctrlIdl } from 'srcPath/../../idls/card_controller.idl';
import { BaseConnection, _createActor } from './baseConnection';

export const aaCid = process.env.AACID
export class CtrlConnection extends BaseConnection<ctrlService> {
  constructor(
    public delegationIdentity: DelegationIdentity,
    public canisterId: string,
    public actor: ActorSubclass<ctrlService>,
    public agent: HttpAgent,
  ) {
    super(delegationIdentity, canisterId, ctrlIdl, actor, agent);
  }

  static async create(
    delegationIdentity: DelegationIdentity,
  ): Promise<CtrlConnection> {
    const canisterId = aaCid
    console.log('ctrl canisterId', canisterId);
    const { actor, agent } = await _createActor<ctrlService>(ctrlIdl, canisterId!, delegationIdentity);
    return new CtrlConnection( delegationIdentity, canisterId!, actor, agent);
  }
  
  async activate(params: ActiveRequest): Promise<boolean> {
    try {
      const result = await this.actor.activate(params);
      console.log('activate result', result);
      if (hasOwnProperty(result, 'Ok')) {
        return true
      } 
      return false
    } catch (err) {
      console.log('err', err);
      return false
    }
  }

  async get_contract(card_code: string): Promise<GetContractResponse | void> {
    try {
      const result = await this.actor.get_contract(card_code);
      if(hasOwnProperty(result, 'Ok')) { 
        return result['Ok']
      }
      console.log('activate result', result);
    } catch (err) {
      console.log('err', err)
      // return await this.get_contract(card_code);
    }
  }

  async get_my_contracts(): Promise<Contract[] | []> {
    try {
      const result = await this.actor.get_my_contracts();
      console.log('activate result', result);
      return result;
    } catch (err) {
      return []
      // return this.get_my_contracts();
    }
  }


  
}
