import { createModel } from '@rematch/core'
import type { RootModel } from '../store/models'
import { contractsAddress, defaultNetwork } from 'srcPath/config/constants'
import {
  Chain,
  connect,
  getAccount,
  getClient,
  getNetwork,
  getProvider,
  switchNetwork,
} from '@wagmi/core'
import { MockConnector } from '@wagmi/core/connectors/mock'
import {
  CollectionsType,
  getAllUserNFTs,
  getAllUserTokens,
  ICSCANNFTDetail,
  UserToken,
} from 'srcPath/utils/assets'
import { LocalStorage, LSKeyEnum } from 'srcPath/utils/localStorage'
import {
  balanceToString,
  principalToAccountIdentifier,
} from 'srcPath/utils/converter'
import {
  aaCid,
  CtrlConnection,
} from 'srcPath/services/ctrlConnection'
import { SafeEventEmitterProvider } from '@web3auth/base'
import { ethers } from 'ethers'
import { ECDSASigner } from 'srcPath/services/ego/signer'
import { CardConnection } from 'srcPath/services/cardConnection'
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1'
import { _createActor } from 'srcPath/services/baseConnection'
import {
  ActiveRequest,
  GetContractResponse,
  PremintRequest,
  _SERVICE as ctrlService,
} from 'srcPath/../../idls/card_controller'
import { idlFactory as ctrlIdl } from 'srcPath/../../idls/card_controller.idl'
import { flattenDeep } from 'lodash'
import {
  hasOwnProperty,
  intentFromUrl,
  ordService,
  UserIntent,
} from 'srcPath/utils'
import {
  AddressType,
  Inscription,
  OrdCanisterSigner,
} from 'srcPath/services/ord'

export type WalletProps = {
  address: string
  card_code: string
  // account_identifier?:string;
  principal?: string
  // walletType: 'eoa' | 'ic'
}

type AppProps = {
  userInfo: any
  account: any
  initProccess: boolean
  provider: SafeEventEmitterProvider | null
  privateKey: string
  delegationIdentity: Secp256k1KeyIdentity | null
  ctrlConnection: CtrlConnection | null
  cardConnection: CardConnection | null
  contract: GetContractResponse | null
  selectWallet: WalletProps
  ECDSASignerStore: ECDSASigner | null
  ordCanisterSigner: OrdCanisterSigner | null
  selectNetwork: Chain & { iconUrl: string }
  intent: UserIntent | null
  screen: {
    width: number
    height: number
    isSmall: boolean
  }
  userCollections: {
    collections: ICSCANNFTDetail[]
    collectionClass: CollectionsType[]
    isLoading: boolean
  }
  userTokens: {
    tokens: UserToken[]
    isLoading: boolean
  }
  userInscriptions: {
    inscriptions: Inscription[]
    isLoading: boolean
  }
}

export const app = createModel<RootModel>()({
  state: {
    userInfo: null,
    provider: null,
    account: null,
    initProccess: false,
    privateKey: '',
    delegationIdentity: null,
    ctrlConnection: null,
    cardConnection: null,
    ECDSASignerStore: null,
    ordCanisterSigner: null,
    contract: null,
    selectWallet: {
      // address: new URLSearchParams(window.location.search).get('address') || localStorage.getItem('address'),
      // code: new URLSearchParams(window.location.search).get('code') || localStorage.getItem('code'),
      address: '',
      card_code:
        new URLSearchParams(window.location.search).get('card_code') ||
        localStorage.getItem('card_code'),
    },
    selectNetwork: defaultNetwork,
    intent: intentFromUrl(new URL(window.location.href)),
    userCollections: {
      collectionClass: [],
      collections: [],
      isLoading: true,
    },
    userTokens: {
      tokens: [],
      isLoading: true,
    },
    userInscriptions: {
      inscriptions: [],
      isLoading: false,
    },
    screen: {
      isSmall: document.body.clientWidth < 768,
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    },
  } as AppProps,
  reducers: {
    save(state: AppProps, payload) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    async switchNetwork(network: Chain, rootState) {
      const {
        privateKey,
        ctrlConnection,
        cardConnection,
        ECDSASignerStore,
        ordCanisterSigner,
      } = rootState.app
      dispatch.app.save({ initProccess: true })
      let newOrdCanisterSigner = ordCanisterSigner
      let newECDSASignerStore = ECDSASignerStore
      if (network.network === 'bitcoin') {
        newOrdCanisterSigner =
          ordCanisterSigner === null
            ? await OrdCanisterSigner.fromActor(
                `m/84'/0'/0'/0/0`,
                cardConnection?.actor!,
                AddressType.P2WPKH
              )
            : ordCanisterSigner
        newOrdCanisterSigner.connect(ordService)
      } else if (network.network === 'IC') {
      } else {
        const wagmiClient = getClient()
        console.log('getProvider===', getProvider())
        newECDSASignerStore =
          newECDSASignerStore === null
            ? await ECDSASigner.fromActor(
                "m/44'/60'/0'/0/0",
                cardConnection?.actor!,
                getProvider()
              )
            : ECDSASignerStore
        await wagmiClient.connector?.disconnect()
        await connect({
          connector: new MockConnector({
            chains: wagmiClient?.chains,
            options: {
              signer: newECDSASignerStore as ECDSASigner,
              // chainId: process.env.isProduction ? network.id : chain.localhost.id,
            },
          }),
        })
      }
      await dispatch.app.save({
        selectNetwork: network,
        ordCanisterSigner: newOrdCanisterSigner,
        ECDSASignerStore: newECDSASignerStore,
      })
      console.log('network.id ', network.id)
      // await switchNetwork({ chainId: network.id });
      try {
        await dispatch.app.getAddress(network)
        await dispatch.setting.getTokensConfig({})
        await dispatch.app.getTokens({})
        if (network.network === 'bitcoin') {
          await dispatch.app.getAllInscriptions({
            ordCanisterSigner: newOrdCanisterSigner,
          })
        } else {
          await dispatch.app.getCollections({})
        }
        dispatch.app.save({ initProccess: false })
      } catch (error) {
        dispatch.app.save({ initProccess: false })
      }
    },
    async initCtrl(payload, rootState) {
      const { card_code } = rootState.app.selectWallet
      const { delegationIdentity } = payload
      const ctrlConnection = await CtrlConnection.create(
        delegationIdentity
      )
      await dispatch.app.save({
        ctrlConnection,
        // CardConnection
      })
      dispatch.app.save({ initProccess: true })
      if (card_code) {
        const contracts = await ctrlConnection.get_my_contracts()
        if (contracts && contracts.length > 0) {
          const contract = contracts[0]
          dispatch.app.initcard({
            canisterId: contract?.contract_address.toText()!,
          })
          dispatch.app.save({ contract })
          return
        }
        const contract = await dispatch.app.get_contract_by_code({})
        if (contract) {
          dispatch.app.save({ contract })
          if (!hasOwnProperty(contract?.status, 'ACTIVATED')) {
            dispatch.app.save({ initProccess: false })
          } else {
            dispatch.app.initcard({
              canisterId: contract?.contract_address.toText()!,
            })
          }
        } else {
          dispatch.app.save({ initProccess: false })
        }
      } else {
        const contracts = await ctrlConnection.get_my_contracts()
        if (contracts) {
          const contract = contracts[0]
          dispatch.app.initcard({
            canisterId: contract?.contract_address.toText()!,
          })
          dispatch.app.save({ contract })
        }
      }
    },
    async initcard(payload: { canisterId: string }, rootState) {
      const { delegationIdentity } = rootState.app
      console.log(
        'initcard ',
        delegationIdentity,
        delegationIdentity?.getPublicKey(),
        payload.canisterId
      )
      const cardConnection = await CardConnection.create(
        delegationIdentity!,
        payload.canisterId
      )
      dispatch.app.save({
        cardConnection,
      })

      await dispatch.app.switchNetwork(defaultNetwork)
      dispatch.setting.getChainBrowserConfig({})
    },
    async get_contract_by_code(
      payload,
      rootState
    ): Promise<GetContractResponse | void> {
      const { card_code } = rootState.app.selectWallet
      const { ctrlConnection } = rootState.app
      const result = await ctrlConnection?.get_contract(card_code)
      if (result) {
        return result
      } else {
        ;(window.parent ?? window.opener)?.postMessage(
          {
            kind: 'auth-failed',
            data: null,
          },
          '*'
        )
      }
    },

    async getAddress(payload, rootState) {
      const {
        selectNetwork,
        ctrlConnection,
        cardConnection,
        selectWallet,
        ECDSASignerStore,
        intent,
        contract,
      } = rootState.app
      const currentNetwork = payload.network ?? selectNetwork.network
      if (ctrlConnection && cardConnection) {
        if (currentNetwork === 'IC') {
          const icpGetAccounts = await cardConnection?.icpGetAccounts()
          dispatch.app.save({
            selectWallet: {
              address: icpGetAccounts[0].account_identifier,
              card_code: selectWallet.card_code,
              principal: `${icpGetAccounts[0].principal.toText()}`,
            },
          })
          ;(window.opener ?? window.parent)?.postMessage(
            {
              kind: 'auth-success',
              data: {
                principal: `${icpGetAccounts[0].principal.toText()}`,
                account: principalToAccountIdentifier(
                  // @ts-ignore
                  icpGetAccounts[0].principal
                ),
              },
            },
            '*'
          )
        } else if (currentNetwork === 'bitcoin') {
          const result =
            await cardConnection.actor.wallet_segwit_address_get(true)
          if (hasOwnProperty(result, 'Ok')) {
            const address = result['Ok']
            dispatch.app.save({
              contract,
              selectWallet: {
                address: `${address}`,
                card_code: contract?.card_code,
              },
            })
            ;(window.opener ?? window.parent)?.postMessage(
              {
                kind: 'auth-success',
                data: {
                  account: `${address}`,
                  principal: '',
                  status: contract?.status,
                },
              },
              '*'
            )
          }
        } else {
          const address = await ECDSASignerStore?.getAddress()
          dispatch.app.save({
            selectWallet: {
              address: `${address}`,
              card_code: selectWallet?.card_code,
            },
          })
          ;(window.opener ?? window.parent)?.postMessage(
            {
              kind: 'auth-success',
              data: {
                account: `${address}`,
                principal: '',
                status: contract?.status,
              },
            },
            '*'
          )
        }
      }
    },

    async getTokens(payload, rootState) {
      dispatch.app.save({
        userTokens: { ...rootState.app.userTokens, isLoading: true },
      })
      const selectWallet: WalletProps =
        payload.selectWallet ?? rootState.app.selectWallet
      const selectNetwork: Chain =
        payload.selectNetwork ?? rootState.app.selectNetwork
      const newPrices = rootState.setting.newPrices
      const tokensConfig =
        rootState.setting.tokensConfig[rootState.app.selectNetwork.network]
      if (!selectWallet) {
        return
      }
      const result = await getAllUserTokens({
        address:
          selectNetwork.network === 'IC'
            ? selectWallet.principal!
            : selectWallet.address,
        getTokens: payload.getTokens ?? tokensConfig,
        network: selectNetwork,
      })
      await result.match(
        async (userTokenResults) => {
          // Extract all successfully fetched tokens, don't care if some of them failed
          const userTokens = userTokenResults.reduce<UserToken[]>(
            (acc, result) => (result.isOk() ? acc.concat(result.value) : acc),
            []
          )
          const oldTokens =
            rootState.app.userTokens.tokens.length > 0
              ? rootState.app.userTokens.tokens
              : tokensConfig
          const tokens = payload.getTokens
            ? [...oldTokens]
                .map((oldToken) => {
                  const found = userTokens.find(
                    (o) => o.contractAddress === oldToken.contractAddress
                  )
                  if (found) {
                    return found
                  } else {
                    return oldToken
                  }
                })
                .map((userToken) => ({
                  ...userToken,
                  balance: userToken.balance ?? 0,
                  balanceFormatString: balanceToString(
                    BigInt(userToken.balance ?? 0),
                    Number(userToken.digits)
                  )?.formatTotal,
                  balanceToString: balanceToString(
                    BigInt(userToken.balance ?? 0),
                    Number(userToken.digits)
                  )?.formatTotal,
                }))
            : userTokens.map((userToken) => ({
                ...userToken,
                balance: userToken.balance ?? 0,
                balanceFormatString: balanceToString(
                  BigInt(userToken.balance ?? 0),
                  Number(userToken.digits)
                )?.formatTotal,
                balanceToString: balanceToString(
                  BigInt(userToken.balance ?? 0),
                  Number(userToken.digits)
                )?.formatTotal,
              }))

          //计算价格
          const priceTokens = await Promise.all(
            tokens.map(async (token: UserToken) => {
              //是否需要更新，超10分钟更新
              const oldPrice = newPrices[`${token.symbol}USDT`]
              let priceData
              if (oldPrice) {
                priceData =
                  new Date().getTime() > oldPrice.timestamp + 60 * 10 * 1000
                    ? await dispatch.setting.getNewPrices({
                        symbol: `${token.symbol}/USDT`,
                      })
                    : oldPrice
              } else if (token.symbol !== 'USDT') {
                priceData = await dispatch.setting.getNewPrices({
                  symbol: `${token.symbol}/USDT`,
                })
              }
              const price =
                token.symbol === 'USDT'
                  ? 1
                  : token.symbol === 'WICP'
                  ? newPrices && newPrices['ICPUSDT']?.price
                  : priceData?.price
              return {
                ...token,
                price,
                balance_usd:
                  price &&
                  balanceToString(
                    BigInt(Math.floor(price * Number(token.balance ?? 0))),
                    Number(token.digits)
                  )?.formatTotalTo2,
              }
            })
          )
          console.log('priceTokens', priceTokens)
          dispatch.app.save({
            userTokens: { isLoading: false, tokens: priceTokens },
          })
          // const serializedTokens = JSON.stringify(
          //   tokens.map(token => ({
          //     ...token,
          //   })),
          // );
          // window.localStorage.setItem('me-user-tokens', serializedTokens);
        },
        async (e) => {
          dispatch.app.save({
            userTokens: { ...rootState.app.userTokens, isLoading: false },
          })
          console.error(e)
        }
      )
    },
    async getCollections(payload, rootState) {
      const { selectWallet } = rootState.app
      const nftResult = await getAllUserNFTs({
        // user: Principal.fromText('imuyn-kuysk-2y4xa-moyu2-knwof-g5lsz-dpd7v-pjkzu-hldud-g5uz2-gae'),
        address: selectWallet.address,
        collectionClass: [
          {
            contractAddress: contractsAddress.polygon,
            name: 'Astro Card',
            minSize: 400,
          },
        ],
      })
      // dispatch.app.save({ userTokens: { isLoading: false, tokens: priceTokens } });
      let userCollections
      console.log('nftResult', nftResult)
      await nftResult.match(
        (result) => {
          console.log('nftResult result=======', result)
          const userCollectionsFormat = result.userCollections.map(
            (collectClass) => {
              // collectClass.children =  nftsJSON as unknown as NFTDetails[];
              return {
                ...collectClass,
                children: collectClass.children?.map((nft) => {
                  return {
                    ...nft,
                  }
                }),
              }
            }
          )
          userCollections = {
            collections: flattenDeep(
              userCollectionsFormat.map((o) => o.children ?? [])
            ),
            collectionClass: userCollectionsFormat,
            isLoading: false,
          }
          dispatch.app.save({
            userCollections,
          })
          return userCollections
        },
        //@ts-ignore
        (e) => {
          // Failed to fetch
          if (process.env.isProduction) {
            dispatch.app.save({
              userCollections: {
                ...rootState.app.userCollections,
                isLoading: false,
              },
            })
          } else {
            dispatch.app.save({
              userCollections: {
                ...rootState.app.userCollections,
                // collections: flattenDeep(localNfts.map(o => o.children)),
                // collectionClass: localNfts,
                isLoading: false,
              },
            })
          }

          console.error(e)
        }
      )
    },
    async getAllInscriptions(payload, rootState) {
      const { ordCanisterSigner: rootOrdSigner, selectWallet } = rootState.app
      const { ordCanisterSigner } = payload
      // const result = await (rootOrdSigner ?? ordCanisterSigner)?.getAllInscriptions({ sync: true })
      const result = await (rootOrdSigner ?? ordCanisterSigner)
        .getService()
        .getAddressInscriptions(selectWallet.address)

      console.log('getAllInscriptions', result)
      dispatch.app.save({
        userInscriptions: {
          inscriptions: result ?? [],
        },
      })
    },
  }),
})
