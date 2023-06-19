import { SignIdentity, Signature, toHex } from '@dfinity/agent'
import {
  DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity,
  isDelegationValid,
} from '@dfinity/identity'
import { toHexString } from '../ord'

export type EventHandler = (event: MessageEvent) => Promise<void>

const KEY_ICSTORAGE_KEY = 'm3-storage-key'
const KEY_ICSTORAGE_IDENTITY = 'm3-storage-identity'
const KEY_ICSTORAGE_WALLET = 'm3-wallet'
// export const PROVIDER_URL_DEFAULT = 'http://localhost:3006';
export const PROVIDER_URL_DEFAULT =
  'https://kcmof-aiaaa-aaaai-abcxa-cai.raw.ic0.app'
export const FRAME_SETTING =
  'height=600, width=800, top=0, right=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no'

export type ClientResponse =
  | { kind: 'auth-ready'; data: null }
  | { kind: 'auth-success'; data: AuthSuccessResponse }
  | { kind: 'auth-failed'; data: string }
  | { kind: 'auth-logout'; data: string }
  | { kind: 'transaction-ready'; data: null }
  | { kind: 'transaction-success'; data: { hash: string } }
  | { kind: 'transaction-cancel'; data: string }

export type AuthSuccessResponse = {
  identity: IdentityResponse
  wallet: Wallet
}

export type AuthClientOptions = {
  providerUrl?: string
  idpWindowOption?: string
}
export type IdentityResponse = {
  email: string
  chain: string
}
export type Wallet = {
  principal: string
  account: string
  status: 'NET' | 'ACTIVATED'
}
export type Bytes = ArrayLike<number>
export type BigNumberish = bigint | string | number
export type BytesLike = Bytes | string

export type TransactionRequest = {
  to?: string
  from?: string
  nonce?: BigNumberish

  gasLimit?: BigNumberish
  gasPrice?: BigNumberish

  data?: BytesLike
  value?: BigNumberish
  chainId?: number

  type?: number

  maxPriorityFeePerGas?: BigNumberish
  maxFeePerGas?: BigNumberish

  customData?: Record<string, any>
  ccipReadEnabled?: boolean
}

enum ClientEventKind {
  AUTH_READY = 'auth-ready',
  AUTH_SUCCESS = 'auth-success',
  AUTH_FAILED = 'auth-failed',
  AUTH_LOGOUT = 'auth-logout',
  TRANSACTION_READY = 'transaction-ready',
  TRANSACTION_SUCCESS = 'transaction-success',
  TRANSACTION_FAILED = 'transaction-cancel',
}

let iframeElement: HTMLIFrameElement | null = null

export class AuthClient {
  #options: AuthClientOptions
  #idpWindowOption?: string
  #idpWindow?: Window
  #eventHandler?: (event: MessageEvent) => void
  #sessionKey?: Ed25519KeyIdentity | undefined
  #wallet?: Wallet | undefined
  #identity?: SignIdentity | undefined
  #userName?: string | undefined
  protected constructor({
    options,
    wallet,
    identity,
    userName,
    sessionKey,
  }: {
    options: AuthClientOptions
    wallet?: Wallet | undefined
    identity?: SignIdentity | undefined
    userName: string | undefined
    sessionKey?: Ed25519KeyIdentity | undefined
  }) {
    this.#options = options
    this.#wallet = wallet
    this.#identity = identity
    this.#sessionKey = sessionKey
    this.#userName = userName
    this.#idpWindowOption = options.idpWindowOption ?? FRAME_SETTING
  }

  public static create(
    options: AuthClientOptions = {
      idpWindowOption: FRAME_SETTING,
    }
  ): AuthClient{
    //初始化
    // const url = `${
    //   (options.providerUrl as string) ?? PROVIDER_URL_DEFAULT
    // }?`
    // var iframe = document.createElement('iframe')
    // iframe.src = url
    // iframe.width = '1'
    // iframe.height = '0'
    // if (!iframeElement) {
    //   iframeElement = iframe
    //   document.body.appendChild(iframe)
    // }

    // return new Promise((resolve, reject) => {
    //   window.addEventListener('message', (event) => {
    //     const message = event.data as ClientResponse
    //     if (event.data.kind === ClientEventKind.AUTH_SUCCESS) {
    //       const wallet = (message.data as unknown as any).wallet as Wallet
    //       resolve(
    //         new AuthClient({
    //           options,
    //           identity: (message.data as unknown as any).identity as SignIdentity,
    //           wallet: {
    //             ...wallet,
    //             status: Object.hasOwnProperty.call(wallet.status, 'ACTIVATED')
    //               ? 'ACTIVATED'
    //               : 'NET',
    //           } as Wallet,
    //         })
    //       )
    //     } else if (event.data.kind === ClientEventKind.AUTH_FAILED) {
    //       resolve(
    //         new AuthClient({
    //           options,
    //           wallet: undefined,
    //           identity: undefined,
    //         })
    //       )
    //     }
    //   })
    // })
    const keyString = localStorage.getItem(KEY_ICSTORAGE_KEY)
    const identityString = localStorage.getItem(KEY_ICSTORAGE_IDENTITY)
    const walletString = localStorage.getItem(KEY_ICSTORAGE_WALLET)
    if (keyString && identityString) {
      const identityLocal = JSON.parse(identityString) as IdentityResponse
      const chain = DelegationChain.fromJSON(identityLocal.chain)
      if (!isDelegationValid(chain)) {
        localStorage.removeItem(KEY_ICSTORAGE_KEY)
        localStorage.removeItem(KEY_ICSTORAGE_IDENTITY)
        localStorage.removeItem(KEY_ICSTORAGE_WALLET)
        return new AuthClient({
          options,
          wallet: undefined,
          identity: undefined,
          userName: undefined,
        })
      } else {
        const key = Ed25519KeyIdentity.fromJSON(keyString as string)
        console.log('keyString', JSON.stringify(key))
        const delegationIdentity = DelegationIdentity.fromDelegation(key, chain)
        console.log('delegationIdentity', toHexString(delegationIdentity.getPublicKey().toDer()) )
        return new AuthClient({
          options,
          identity: delegationIdentity,
          sessionKey: key,
          wallet: walletString ? JSON.parse(walletString) : undefined,
          userName: identityLocal.email,
        })
      }
    } else {
      return new AuthClient({
        options,
        wallet: undefined,
        identity: undefined,
        userName: undefined,
      })
    }
  }

  private async _handleLoginSuccess(
    message: ClientResponse,
    onSuccess?: () => void | Promise<void>
  ): Promise<{ identity: SignIdentity; wallet?: Wallet}> {
    // const wallet = (message as unknown as any).wallet
    // const walletData: Wallet = {
    //   principal: wallet?.principal,
    //   account: wallet?.account,
    //   status: Object.hasOwnProperty.call(wallet.status, 'ACTIVATED')
    //     ? 'ACTIVATED'
    //     : 'NET',
    // }
    this.#wallet = undefined
    const chainString = (message as unknown as any).identity
      .chain as string
    const chain = DelegationChain.fromJSON(chainString)
    this.#identity = DelegationIdentity.fromDelegation(this.#sessionKey!, chain)
    localStorage.setItem(
      KEY_ICSTORAGE_IDENTITY,
      JSON.stringify((message as unknown as any).identity)
    )
    this.#userName = (message as unknown as any).identity.email;
    console.log('publicKey', toHexString((this.#identity.getPublicKey().toDer())), chain, chainString )
    // localStorage.setItem(KEY_ICSTORAGE_WALLET, JSON.stringify(''))
    onSuccess && (await onSuccess())
    return {
      identity: this.#identity,
      wallet: this.#wallet,
    }
  }

  get userName(): string | undefined {
    return this.#userName;
  }

  get sessionKey(): Ed25519KeyIdentity | undefined {
    return this.#sessionKey;
  }

  get identity(): SignIdentity | undefined { 
    return this.#identity
  }

  get wallet(): Wallet | undefined {
    return this.#wallet
  }

  get idpWindow(): Window | undefined {
    return this.#idpWindow
  }

  get isAuthenticated():boolean {
    return this.#identity !== null
  }

  public async login(options?: AuthClientOptions): Promise<void> {
    this.#idpWindow?.close()
    this._removeEventListener()
    const providerUrl = this.#options?.providerUrl ?? PROVIDER_URL_DEFAULT
    console.log(this.#idpWindowOption)
    let key = this.#sessionKey
    if (!key) {
      // Create a new key (whether or not one was in storage).
      key = Ed25519KeyIdentity.generate()
      this.#sessionKey = key
      localStorage.setItem(KEY_ICSTORAGE_KEY, JSON.stringify(key))
    }
    this.#idpWindow =
      window.open(
        `${providerUrl}/?#authorize`,
        'idpWindow',
        this.#idpWindowOption
      ) ?? undefined
    // Add an event listener to handle responses.

    return new Promise((resolve, reject) => {
      this.#eventHandler = this._getEventHandler(
        new URL(providerUrl),
        resolve,
        reject,
        options
      )
      window.addEventListener('message', this.#eventHandler)
    })
  }

  public async transaction(request?: TransactionRequest): Promise<void> {
    this.#idpWindow?.close()
    this._removeEventListener()
    console.log('this.options', this.#options)
    const providerUrl = this.#options?.providerUrl ?? PROVIDER_URL_DEFAULT
    this.#idpWindow =
      window.open(
        `${providerUrl}/#transaction`,
        'idpWindow',
        this.#idpWindowOption
      ) ?? undefined
    return new Promise((resolve, reject) => {
      this.#eventHandler = this._getEventHandler(
        new URL(providerUrl),
        resolve,
        reject,
        request
      )
      window.addEventListener('message', this.#eventHandler)
    })
  }

  private _getEventHandler(
    providerUrl: URL,
    resolve: (value: any) => void,
    reject: (reason?: any) => void,
    options?: any
  ): EventHandler {
    return async (event: MessageEvent) => {
      if (event.origin !== providerUrl.origin) {
        return
      }

      const message = event.data
      console.log('message.kind', message.kind)
      switch (message.kind) {
        case ClientEventKind.AUTH_READY: {
          const request = {
            kind: 'authorize-client',
            sessionPublicKey: toHexString(this.#sessionKey?.getPublicKey().toDer()!) ,
          }
          this.#idpWindow?.postMessage(request, providerUrl.origin)
          break
        }
        case ClientEventKind.AUTH_SUCCESS:
          try {
            const successResp = await this._handleLoginSuccess(
              message,
              options?.onSuccess
            )
            console.log('success', successResp)
            resolve(successResp)
          } catch (err) {
            reject(
              this._handleFailure((err as Error).message, options?.onError)
            )
          }
          this.#idpWindow?.close()
          break
        case ClientEventKind.AUTH_FAILED:
          reject(this._handleFailure(message.text, options?.onError))
          break
        case ClientEventKind.TRANSACTION_READY:
          console.log('ready', options)
          const request: {
            kind: 'transaction-client'
            sendData: TransactionRequest
          } = {
            kind: 'transaction-client',
            sendData: {
              ...(options as TransactionRequest),
            },
          }
          this.#idpWindow?.postMessage(request, providerUrl.origin)
          break

        case ClientEventKind.TRANSACTION_SUCCESS:
          console.log('success=======')
          resolve(message.data)
          break
        case ClientEventKind.TRANSACTION_FAILED:
          reject(this._handleFailure((message as unknown as any).text))
          break

        default:
          break
      }
    }
  }

  private _handleFailure(
    errorMessage?: string,
    onError?: (error?: string) => void
  ): string | undefined {
    this.#idpWindow?.close()
    onError?.(errorMessage)
    this._removeEventListener()
    return errorMessage
  }

  private _removeEventListener() {
    if (this.#eventHandler) {
      window.removeEventListener('message', this.#eventHandler)
    }
    this.#eventHandler = undefined
  }

  public logout(options: { returnTo?: string } = {}): void {
    this.#identity = undefined;
    this.#wallet = undefined;
    this.#sessionKey = undefined;
    this.#userName = undefined;
    localStorage.removeItem(KEY_ICSTORAGE_IDENTITY)
    localStorage.removeItem(KEY_ICSTORAGE_KEY)
    localStorage.removeItem(KEY_ICSTORAGE_WALLET)
  }
}
