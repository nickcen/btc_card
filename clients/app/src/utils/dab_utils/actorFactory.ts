import { HttpAgent, Actor, ActorMethod, ActorSubclass } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import { InternalTokenMethods } from '../tokens/methods';

type ExtendedActorConstructor = new () => ActorSubclass;

export type BaseMethodsExtendedActor_<T> = {
  [K in keyof T as `_${Uncapitalize<string & K>}`]: T[K];
};

export type BaseMethodsExtendedActor<T> = {
  [K in keyof T as `${Uncapitalize<string & K>}`]: T[K];
};

export const createExtendedActorClass = (
  agent: HttpAgent,
  methods: any,
  canisterId: string | Principal,
  IDLFactory: IDL.InterfaceFactory,
): ExtendedActorConstructor => {
  class ExtendedActor extends Actor.createActorClass(IDLFactory) {
    constructor() {
      const principalCanisterId = typeof canisterId === 'string' ? Principal.fromText(canisterId) : canisterId;
      super({ agent, canisterId: principalCanisterId });
      console.log('Object this', Object.keys(this));
      console.log('Object methods', Object.keys(methods));
      Object.keys(this).forEach(methodName => {
        this[`_${methodName}`] = this[methodName];
      });

      Object.keys(methods).forEach(methodName => {
        this[methodName] = ((...args: unknown[]) => methods[methodName](this, ...args) as unknown) as ActorMethod;
      });
    }
  }

  return ExtendedActor;
};

export function generateActor<T>({ agent, canisterId, IDL }: { agent: HttpAgent; canisterId: string; IDL: IDL.InterfaceFactory }): ActorSubclass<T> {
  return Actor.createActor<T>(IDL, {
    agent,
    canisterId: Principal.fromText(canisterId),
  });
}

export default { createExtendedActorClass, generateActor };
