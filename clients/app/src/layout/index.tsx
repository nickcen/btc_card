import { CHAIN_CONFIG_TYPE } from '../config/chainConfig'
import { useWeb3Auth, Web3AuthProvider } from '../services/web3auth'
import { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootDispatch, RootState } from 'srcPath/store'
import { hasOwnProperty, initWagmiClient, intentFromUrl } from 'srcPath/utils'
import { Button, Modal, Toast } from 'antd-mobile'
import { aaCid } from 'srcPath/services/ctrlConnection'
import { sendActivateCode } from 'srcPath/utils/http/api/api'
import { useConnect, useWallet } from '@connect2ic/react'
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1'
import { useM3Auth } from 'srcPath/services/m3Provider'
import { SignIdentity, toHex } from '@dfinity/agent'
import { fromHexString, toHexString } from 'srcPath/services/ord'
import {
  DelegationChain,
  DelegationIdentity,
  Ed25519PublicKey,
  WebAuthnIdentity,
} from '@dfinity/identity'
import { DeviceDataExternal } from 'srcPath/candid/me'

export interface UserData {
  name: string
  email: string
}

const Layout = () => {
  const {
    login,
    provider,
    walletProvider,
    web3Auth,
    isLoading,
    wagmiClient,
    logout,
  } = useWeb3Auth()
  const {
    login: m3Login,
    isConnected: m3IsConnected,
    logout: m3Disconnect,
    identity: m3Identity,
    client: m3Client,
    email: m3Email,
  } = useM3Auth()
  const { isConnected, activeProvider } = useConnect()

  const {
    selectWallet,
    contract,
    selectNetwork,
    cardConnection,
    ctrlConnection,
    initProccess,
    userInfo,
  } = useSelector((state: RootState) => state.app)
  const navigator = useNavigate()
  const dispatch = useDispatch<RootDispatch>()
  const isOwnerRef = useRef(false)
  const sendCodeRef = useRef(false)
  const intent = intentFromUrl(new URL(window.location.href))
  // const navigate = useNavigate()

  useEffect(() => {
    window.addEventListener('message', (event) => {
      const message = event.data
      if (message.kind === 'auth-logout') {
        console.log('logout======')
        logout()
      }
    })
  }, [])

  useEffect(() => {
    const init = async () => {
      // dispatch.app.get_contract({})
    }
    if (wagmiClient) {
      init()
    }
  }, [dispatch.app, dispatch.setting, wagmiClient])

  const getIdentity = async () => {
    const creationOptions = (
      exclude: DeviceDataExternal[] = [],
      userData?: UserData,
      authenticatorAttachment?: AuthenticatorAttachment
    ): PublicKeyCredentialCreationOptions => {
      return {
        authenticatorSelection: {
          userVerification: 'preferred',
          authenticatorAttachment,
        },
        excludeCredentials: exclude.flatMap((device) =>
          device.credential_id.length === 0
            ? []
            : {
                id: new Uint8Array(device.credential_id[0]),
                type: 'public-key',
              }
        ),
        challenge: Uint8Array.from('<ic0.app>', (c) => c.charCodeAt(0)),
        pubKeyCredParams: [
          {
            type: 'public-key',
            // alg: PubKeyCoseAlgo.ECDSA_WITH_SHA256
            alg: -7,
          },
          {
            type: 'public-key',
            // alg: PubKeyCoseAlgo.RSA_WITH_SHA256
            alg: -257,
          },
        ],
        rp: {
          name: 'M3 ID',
        },
        user: {
          id: crypto.getRandomValues(new Uint8Array(16).fill(0)),
          name: userData?.email ?? 'M3 User',
          displayName: userData?.email ?? userData?.name ?? 'M3 User',
        },
      }
    }
    const options = creationOptions(
      [],
      {
        name: 'test',
        email: 'test',
      },
      'platform'
    )
    const pendingIdentity = Secp256k1KeyIdentity.generate()

    const hexString = toHexString(m3Client?.sessionKey?.getPublicKey().toDer()!)
    console.log(
      'hexString',
      hexString,
      m3Client?.sessionKey?.getPublicKey().toDer(),
      fromHexString(hexString)
    )
    const chain = await DelegationChain.create(
      pendingIdentity,
      Ed25519PublicKey.fromDer(fromHexString(hexString)),
      new Date(Date.parse('2100-01-01')),
      {
        targets: undefined,
      }
    )

    return DelegationIdentity.fromDelegation(m3Client?.sessionKey!, chain)
  }

  useEffect(() => {
    ;(async () => {
      if (process.env.LOGIN_TYPE === 'm3') {
        console.log('m3 connected init', m3IsConnected, m3Identity)
        if (m3IsConnected && m3Identity) {
          const delegationIdentity = m3Identity as SignIdentity
          // const delegationIdentity = await getIdentity()

          if (!ctrlConnection && delegationIdentity) {
            initWagmiClient()
            dispatch.app.save({
              provider: provider,
              delegationIdentity,
            })
            dispatch.app.initCtrl({
              delegationIdentity,
            })
          } else {
            if (!delegationIdentity) {
              throw new Error("Can't get identity")
            }
          }
        }
      } else if (process.env.LOGIN_TYPE === 'ic') {
        if (isConnected && activeProvider) {
          //@ts-ignore
          const delegationIdentity = activeProvider.client.getIdentity() as Secp256k1KeyIdentity
          if (!ctrlConnection && delegationIdentity) {
            initWagmiClient()
            dispatch.app.save({
              provider: provider,
              delegationIdentity,
            })
            dispatch.app.initCtrl({
              delegationIdentity,
            })
          } else {
            if (!delegationIdentity) {
              throw new Error("Can't get identity")
            }
          }
        }
      }
    })()
  }, [isConnected, activeProvider, m3Identity, m3IsConnected])

  useEffect(() => {
    ;(async () => {
      console.log('switch network getAssets', selectNetwork)
      await dispatch.setting.getTokensConfig({})
      await dispatch.app.getAddress({})
      dispatch.app.getTokens({})
      dispatch.app.getCollections({ page: 0 })
    })()
  }, [selectNetwork])


  useEffect(() => {
    const initUser = async () => {
      const userInfo = await web3Auth?.getUserInfo()
      const account = await walletProvider?.getAccounts()
      console.log('userInfo', userInfo)
      console.log('account', account)
      dispatch.app.save({ userInfo, account })
    }
    if (web3Auth && walletProvider) {
      initUser()
    }
  }, [web3Auth, walletProvider, dispatch.app, selectWallet.address])

  useEffect(() => {
    if (process.env.LOGIN_TYPE === 'ic') {
      if (activeProvider && contract && !initProccess) {
        if (hasOwnProperty(contract?.status ?? {}, 'ACTIVATED')) {
          if (intent?.kind === 'transaction') {
            navigator(`/transaction${location.search}`, { replace: true })
          } else {
            navigator(`/assets${location.search}`, { replace: true })
            // navigator('/transaction', { replace: true} )
          }
        } else {
          if (!hasOwnProperty(contract.status, 'DEPLOYING')) {
            if (sendCodeRef.current) return
            sendCodeRef.current = true
            console.log('sendActivateCode')
          }
          navigator('/active?email=1', { replace: true })
        }
      } else {
        navigator(`/${location.search}`, { replace: true })
      }
    } else if (process.env.LOGIN_TYPE === 'm3') {
      if (m3Identity && contract && !initProccess) {
        if (hasOwnProperty(contract?.status ?? {}, 'ACTIVATED')) {
          if (intent?.kind === 'transaction') {
            navigator(`/transaction${location.search}`, { replace: true })
          } else {
            navigator(`/assets${location.search}`, { replace: true })
            // navigator('/transaction', { replace: true} )
          }
        } else {
          if (!hasOwnProperty(contract.status, 'DEPLOYING')) {
            if (sendCodeRef.current) return
            sendCodeRef.current = true
            // sendActivateCode({
            //   canisterId: aaCid,
            //   cardCode: selectWallet.card_code,
            //   email: m3Email,
            //   providerUrl: window.location.origin,
            // })
            // Toast.show('Activation code sent to your email')
          }
          navigator(`/active${location.search}`, { replace: true })
        }
      } else {
        navigator(`/${location.search}`, { replace: true })
      }
    } else {
      if (!isLoading) {
        if (provider && contract && !initProccess && userInfo) {
          if (hasOwnProperty(contract?.status ?? {}, 'ACTIVATED')) {
            if (intent?.kind === 'transaction') {
              navigator('/transaction', { replace: true })
            } else {
              navigator('/assets', { replace: true })
              // navigator('/transaction', { replace: true} )
            }
          } else {
            if (!hasOwnProperty(contract.status, 'DEPLOYING')) {
              if (sendCodeRef.current) return
              sendCodeRef.current = true
              sendActivateCode({
                canisterId: aaCid,
                cardCode: selectWallet.card_code,
                email: userInfo?.email,
                providerUrl: 'https://icp2anv.card3.co',
              })
              Toast.show('Activation code sent to your email')
            }
            navigator(`/active${location.search}`, { replace: true })
          }
        } else {
          navigator(`/${location.search}`, { replace: true })
        }
      }
    }
  }, [isLoading, provider, contract, initProccess, userInfo, activeProvider])

  return (
    <div className="app-container mx-auto">
      <Outlet />
      {/* <Setting setNetwork={setWeb3AuthNetwork} setChain={setChain} /> */}
    </div>
  )
}

export default Layout
