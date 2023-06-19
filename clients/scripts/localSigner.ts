import { Signer } from '@ethersproject/abstract-signer';
import { Bytes, BytesLike, hexDataSlice, joinSignature } from '@ethersproject/bytes';
import { Provider, TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import { keccak256 } from '@ethersproject/keccak256';
import { Deferrable, resolveProperties } from '@ethersproject/properties';
import { hashMessage } from '@ethersproject/hash';
import { serialize, UnsignedTransaction } from '@ethersproject/transactions';

import { getAddress } from '@ethersproject/address';
import { Logger } from '@ethersproject/logger';
import { computePublicKey } from '@ethersproject/signing-key';
import { ActorSubclass, DerEncodedPublicKey } from '@dfinity/agent';
import { _SERVICE as ECDSAService } from '@/idls/btc_wallet.idl';
import { assert } from 'console';
import { fromHexString } from '@dfinity/candid';
import { Secp256k1KeyIdentity, Secp256k1PublicKey } from '@dfinity/identity-secp256k1';
import { verify } from 'tiny-secp256k1';
import { verifyMessage } from 'ethers/lib/utils';
import { hasOwnProperty } from '@ego-js/utils';
// import { isProduction } from '@/settings/env';
const logger = new Logger('beta');

export function computeAddress(key: BytesLike | string): string {
  const publicKey = computePublicKey(key);
  return getAddress(hexDataSlice(keccak256(hexDataSlice(publicKey, 1)), 12));
}

// const testKey = 'dfx_test_key'; //  'test_key_1'

// use for local development and airdrop
// 1. clear all canisters locally, deploy btc_wallet as the first canister.
// 2. use deploy dfx_test_key to deploy btc_wallet.

// scripts:
// pnpm run ego:create --project=btc_wallet
// pnpm run ego:install --project=btc_wallet

export class ECDSASigner extends Signer {
  private _address: string = '';
  private _publicKey: string = '';
  private actor?: ActorSubclass<ECDSAService>;

  public provider?: Provider;
  constructor(bytesLike: BytesLike | ECDSASigner, provider?: Provider) {
    super();
    if (bytesLike instanceof ECDSASigner) {
      assert(bytesLike.actor, 'Actor is not set');
      this.setActor(bytesLike.actor!);
    } else {
      this._publicKey = computePublicKey(
        bytesLike,
        // bytesLike.length > 33 ? false : true,
      );

      this._address = computeAddress(
        bytesLike,
        // bytesLike.length > 33 ? false : true,
      );
    }
    this.setProvider(provider);
  }
  get publicKey(): string {
    return this._publicKey;
  }
  public setActor(actor: ActorSubclass<ECDSAService>) {
    this.actor = actor;
  }

  public setProvider(provider?: Provider) {
    this.provider = provider;
  }

  async signMessage(message: Bytes | string): Promise<string> {
    const toSignMessage = new Uint8Array(fromHexString(hashMessage(message).replace('0x', '')));
    // const cid = await this.getChainId();

    return joinSignature(await this._signDigest(toSignMessage, 'ECDSASigner.signMessage'));
  }

  public static async fromActor(actor: ActorSubclass<ECDSAService>, provider?: Provider): Promise<ECDSASigner> {
    try {
      const account = await actor.ecGetPublicKey(`m/44'/60'/0'/0/0`, ['dfx_test_key']);
      if (hasOwnProperty(account, 'Ok')) {
        const public_key = account.Ok.public_key_uncompressed;
        const pk = Secp256k1PublicKey.fromRaw(new Uint8Array(public_key));

        const bytesLike = public_key.length > 33 ? new Uint8Array(pk.toRaw()) : public_key;

        const signer = new ECDSASigner(bytesLike, provider);
        signer.setActor(actor);
        signer.setAddress(computeAddress(public_key));
        return signer;
      } else {
        throw new Error(JSON.stringify(account.Err));
      }
    } catch (error) {
      console.log({ error });
      logger.throwArgumentError('ECDSASigner.fromActor failed', 'ECDSASigner.fromActor', error);
      throw new Error(`ECDSASigner.fromActor failed: ${(error as Error).message}`);
    }
  }

  connect(provider: Provider): ECDSASigner {
    return new ECDSASigner(this, provider);
  }

  setAddress(address: string) {
    this._address = '0x' + address;
  }

  async getAddress(): Promise<string> {
    return Promise.resolve(this._address);
  }

  async _signDigest(message: Uint8Array, signingFunctionName: string): Promise<Uint8Array> {
    try {
      // const now = Date.now();
      const bytesResult = await this.actor?.ecSignRecoverable(this._address.replace('0x', '')!, Array.from(message), []);
      // const then = Date.now();
      if (bytesResult && hasOwnProperty(bytesResult, 'Ok')) {
        return new Uint8Array(bytesResult.Ok.signature);
      } else {
        console.log(bytesResult?.Err);
        throw new Error(`${signingFunctionName} Error: ${bytesResult === undefined ? 'Actor is not set' : bytesResult?.Err}`);
      }
    } catch (error) {
      throw error;
    }
  }

  async signTransaction(transaction: TransactionRequest): Promise<string> {
    return resolveProperties(transaction).then(async tx => {
      if (tx.from != null) {
        if (getAddress(tx.from) !== getAddress(this._address)) {
          logger.throwArgumentError('transaction from address mismatch', 'transaction.from', transaction.from);
        }
        delete tx.from;
      }
      const actorSignatureRes = await this._signDigest(
        new Uint8Array(fromHexString(keccak256(serialize(<UnsignedTransaction>tx)).replace('0x', ''))),
        'ECDSASigner.signTransaction',
      );
      // console.log(
      //   verifyMessage(
      //     keccak256(serialize(<UnsignedTransaction>tx)).replace('0x', ''),
      //     actorSignatureRes,
      //   ),
      // );
      return serialize(<UnsignedTransaction>tx, actorSignatureRes);
    });
  }

  async sendTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse> {
    this._checkProvider('sendTransaction');
    const tx = await this.populateTransaction(transaction);

    const signedTx = await this.signTransaction(tx);
    console.log({ signedTx });
    return await this.provider!.sendTransaction(signedTx);
  }
}
