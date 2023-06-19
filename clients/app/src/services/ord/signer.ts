import * as bitcoin from 'bitcoinjs-lib';
import { address as PsbtAddress } from 'bitcoinjs-lib';
import { hasOwnProperty, publicKeyToAddress, toPsbtNetwork } from './util';
import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE as ECDSAService } from 'srcPath/idls/btc_wallet';
import { AddressType, Inscription, InscriptionDetail, NetworkType, TXSendBTC, ToSignInput, TxType, UTXO } from './constant';
import ECPairFactory from 'ecpair';
import ecc from '@bitcoinerlab/secp256k1';
import { createSendBTC, createSendOrd } from './ord/ord';
import { HttpService } from './api/service';

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

const testKey = process.env.isProduction ? 'test_key_1' : 'test_key_1';

export interface TweakOpts {
  tweakHash?: Buffer;
  network?: NetworkType;
  addressType?: AddressType;
  index?: number;
}

export const toXOnly = (pubKey: Buffer) => (pubKey.length === 32 ? pubKey : pubKey.subarray(1, 33));
export const validator = (pubkey: Buffer, msghash: Buffer, signature: Buffer): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature);

export class OrdCanisterSigner implements bitcoin.SignerAsync {
  private actor?: ActorSubclass<ECDSAService>;
  private path?: string;
  private service?: HttpService;
  private utxos?: UTXO[];
  private inscriptions?: Inscription[];
  public static async fromActor(
    path: string,
    actor: ActorSubclass<ECDSAService>,
    addressType: AddressType = AddressType.P2TR,
  ): Promise<OrdCanisterSigner> {
    try {
      const pubRes = await actor.ecGetPublicKey(path, [testKey]);

      if (hasOwnProperty(pubRes, 'Ok')) {
        const public_key = pubRes.Ok.public_key;

        const signer = new OrdCanisterSigner(Buffer.from(public_key), addressType);
        signer.setActor(actor);
        signer.setPath(path);
        return signer;
      } else {
        throw new Error(pubRes.Err);
      }
    } catch (error) {
      throw new Error(`OrdCanisterSigner.fromActor failed: ${(error as Error).message}`);
    }
  }

  constructor(public publicKey: Buffer, public addressType: AddressType = AddressType.P2TR) {}

  sign(hash: Buffer, lowR?: boolean | undefined): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      const result = await this.actor?.ecSign(this.path!, Array.from(hash));
      if (result && hasOwnProperty(result, 'Ok')) {
        resolve(Buffer.from(result.Ok.signature));
      } else {
        reject(result!.Err);
      }
    });
  }
  signSchnorr?(hash: Buffer): Promise<Buffer> {
    throw new Error('Method not implemented.');
  }

  network?: any;

  getPublicKey?(): Buffer {
    return this.publicKey;
  }

  getAddress(addressType?: AddressType): string {
    return publicKeyToAddress(this.publicKey.toString('hex'), addressType ?? this.addressType, NetworkType.MAINNET);
  }
  getPublicKeyString(): string {
    return this.publicKey.toString('hex');
  }

  connect(service: HttpService) {
    this.service = service;
  }

  async signTransaction(
    psbt: bitcoin.Psbt,
    inputs: { index: number; publicKey: string; sighashTypes?: number[] }[],
    opts?: TweakOpts,
  ): Promise<bitcoin.Psbt> {
    let rt: bitcoin.Psbt = psbt;
    for (const input of inputs) {
      await rt.signInputAsync(input.index, this, input.sighashTypes);
    }

    return rt;
  }

  public setActor(actor: ActorSubclass<ECDSAService>) {
    this.actor = actor;
  }
  public setPath(path: string) {
    this.path = path;
  }

  getService(): HttpService {
    if (!this.service) {
      throw new Error('HttpService is not connected');
    } else {
      return this.service;
    }
  }
  async getUtxos({ sync }: { sync?: boolean }): Promise<UTXO[]> {
    const utxos = await this.getService().getAddressUtxo(this.getAddress());
    if (sync) {
      this.utxos = utxos;
    }
    return utxos;
  }

  async getAllInscriptions({ sync }: { sync?: boolean }): Promise<Inscription[]> {
    const inscriptions = (await this.getService().getAddressInscriptions(this.getAddress())).sort((a, b) => b.num - a.num);
    if (sync) {
      this.inscriptions = inscriptions;
    }
    return inscriptions;
  }

  getInscriptionDetailById(id: string): InscriptionDetail {
    const ins = this.inscriptions?.find(v => v.id === id);
    if (!ins) {
      throw new Error('Inscription not found');
    } else {
      return ins.detail!;
    }
  }

  getInscriptionDetailByNumber(num: number): InscriptionDetail {
    const ins = this.inscriptions?.find(v => v.num === num);
    if (!ins) {
      throw new Error('Inscription not found');
    } else {
      return ins.detail!;
    }
  }

  async sendInscription({ to, id, fee, sync }: { to: string; id: string; fee: number; sync?: boolean }): Promise<TXSendBTC> {
    const ins = await this.getAllInscriptions({ sync: sync ?? true });
    const found = ins.find(v => v.id === id);

    if (!found) {
      throw new Error('Inscription not found');
    } else {
      const utxos = await this.getUtxos({ sync: true });
      const sent = await this._sendInscription({
        to,
        inscriptionId: found.id,
        utxos,
        feeRate: fee,
        outputValue: Number.parseInt(found.detail!.output_value),
      });
      return sent;
    }
  }

  signPsbt = async (psbt: bitcoin.Psbt): Promise<bitcoin.Psbt> => {
    const psbtNetwork = toPsbtNetwork(NetworkType.MAINNET);

    const toSignInputs: ToSignInput[] = [];
    psbt.data.inputs.forEach((v, index) => {
      let script: any = null;
      let value = 0;
      if (v.witnessUtxo) {
        script = v.witnessUtxo.script;
        value = v.witnessUtxo.value;
      } else if (v.nonWitnessUtxo) {
        const tx = bitcoin.Transaction.fromBuffer(v.nonWitnessUtxo);
        const output = tx.outs[psbt.txInputs[index].index];
        script = output.script;
        value = output.value;
      }
      const isSigned = v.finalScriptSig || v.finalScriptWitness;
      if (script && !isSigned) {
        const address = PsbtAddress.fromOutputScript(script, psbtNetwork);

        if (this.getAddress() === address) {
          toSignInputs.push({
            index,
            publicKey: this.getPublicKeyString(),
            sighashTypes: v.sighashType ? [v.sighashType] : undefined,
          });
          if (this.addressType === AddressType.P2TR && !v.tapInternalKey) {
            v.tapInternalKey = toXOnly(this.publicKey);
          }
        }
      }
    });

    let psbt2 = await this.signTransaction(psbt, toSignInputs);
    toSignInputs.forEach(v => {
      psbt2.validateSignaturesOfInput(v.index, validator);
      psbt2.finalizeInput(v.index);
    });

    return psbt2;
  };

  sendBTC = async ({
    to,
    amount,
    utxos,
    autoAdjust,
    feeRate,
    addressType,
  }: {
    to: string;
    amount: number;
    utxos: UTXO[];
    autoAdjust: boolean;
    feeRate: number;
    addressType?: AddressType;
  }): Promise<TXSendBTC> => {
    const psbtNetwork = toPsbtNetwork(NetworkType.MAINNET);

    const psbt = await createSendBTC({
      utxos: utxos.map(v => {
        return {
          txId: v.txId,
          outputIndex: v.outputIndex,
          satoshis: v.satoshis,
          scriptPk: v.scriptPk,
          addressType: v.addressType,
          address: this.getAddress(addressType),
          ords: v.inscriptions,
        };
      }),
      toAddress: to,
      toAmount: amount,
      wallet: this,
      network: psbtNetwork,
      changeAddress: this.getAddress(addressType),
      force: autoAdjust,
      pubkey: this.getPublicKeyString(),
      feeRate,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = false;
    const rawTx = psbt.extractTransaction().toHex();
    const txId = await this.getService().pushTx(rawTx);
    return {
      txId,
      psbtHex: psbt.toHex(),
      rawTx,
      txType: TxType.SEND_BITCOIN,
    };
  };

  _sendInscription = async ({
    to,
    inscriptionId,
    utxos,
    feeRate,
    outputValue,
    addressType,
  }: {
    to: string;
    inscriptionId: string;
    utxos: UTXO[];
    feeRate: number;
    outputValue: number;
    addressType?: AddressType;
  }): Promise<TXSendBTC> => {
    const psbtNetwork = toPsbtNetwork(NetworkType.MAINNET);

    const psbt = await createSendOrd({
      utxos: utxos.map(v => {
        return {
          txId: v.txId,
          outputIndex: v.outputIndex,
          satoshis: v.satoshis,
          scriptPk: v.scriptPk,
          addressType: v.addressType,
          address: this.getAddress(addressType),
          ords: v.inscriptions,
        };
      }),
      toAddress: to,
      toOrdId: inscriptionId,
      wallet: this,
      network: psbtNetwork,
      changeAddress: this.getAddress(addressType),
      pubkey: this.getPublicKeyString(),
      feeRate,
      outputValue,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = false;
    const rawTx = psbt.extractTransaction().toHex();
    const txId = await this.getService().pushTx(rawTx);
    return {
      txId,
      psbtHex: psbt.toHex(),
      rawTx,
      txType: TxType.SEND_INSCRIPTION,
    };
  };
}
