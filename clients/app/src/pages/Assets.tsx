import { useWeb3Auth } from 'srcPath/services/web3auth'
import {
  Button,
  Card,
  DotLoading,
  List,
  Loading,
  Mask,
  Modal,
  NoticeBar,
  Popup,
  SpinLoading,
  Tabs,
  Toast,
} from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootDispatch, RootState } from 'srcPath/store'
import { balanceToString } from 'srcPath/utils/converter'
import IconFont from 'srcPath/components/iconfont'
import QrCode from 'qrcode.react'
import {
  MoreOutline,
} from 'antd-mobile-icons'
import {
  CHECK,
  CK_BTC,
  ICP,
  REFRESH,
  TOKEN,
} from 'srcPath/utils/resource'
import { Chain, readContract } from '@wagmi/core'
import thePitIdl from 'srcPath/abi/ThePit.json'
import { getTokenIds, hasOwnProperty } from 'srcPath/utils'
import { BigNumber, ethers } from 'ethers'
import {
  defaultNetwork,
  ICNetwork,
  otherNetworks,
} from 'srcPath/config/constants'
import InscriptionView from 'srcPath/components/Inscription'
import { useConnect, useWallet } from '@connect2ic/react'
import { WalletProps } from 'srcPath/models/app'
import { useM3Auth } from 'srcPath/services/m3Provider'

const TabPane = (tabProps: { type: string; selectWallet: WalletProps }) => {
  const { type, selectWallet } = tabProps
  console.log(type)
  return (
    <div className="mt-3 flex flex-row whitespace-pre-wrap text-xs justify-center">
      <div className="flex-1 bg-2a2b break-all border h-12 rounded-md1 text-white items-center px-2 py-2 border-primary">
        {`${type === 'AID' ? selectWallet.address : selectWallet.principal}`}
      </div>
      <div className="rounded-md1 to-violet-500 bg-primary from-fuchsia-500 h-12 w-12 flex justify-center items-center ml-2 mb-16">
        <IconFont
          name="fuzhi"
          size={20}
          color={'#fff'}
          onClick={() => {
            window.navigator.clipboard.writeText(
              `${
                type === 'AID' ? selectWallet.address : selectWallet.principal
              }`
            )
            Toast.show('Copied!')
          }}
        />
      </div>
    </div>
  )
}

type ReceiveComponentProps = {
  selectWallet: WalletProps
}
const ReceiveComponent: React.FC<ReceiveComponentProps> = (props) => {
  const { selectWallet } = props
  const { selectNetwork } = useSelector((state: RootState) => state.app)
  const [accountType, setAccountType] = useState(
    selectNetwork.network === 'IC' ? 'PID' : 'AID'
  )

  return (
    <div className=" p-6">
      <h2 className="text-white text-2xl font-bold mb-5">Receive</h2>
      <div className="flex justify-center">
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <QrCode
            value={`${
              accountType === 'AID'
                ? selectWallet.address
                : selectWallet.principal
            }`}
            size={240}
            includeMargin
          />
        </div>
      </div>
      <Tabs className="account-tabs" onChange={(key) => setAccountType(key)}>
        <Tabs.Tab title="Address" key="AID">
          <TabPane type={accountType} selectWallet={selectWallet} />
        </Tabs.Tab>
        {selectNetwork.network === 'IC' ? (
          <Tabs.Tab title="Principal ID" key="PID">
            <TabPane type={accountType} selectWallet={selectWallet} />
          </Tabs.Tab>
        ) : null}
      </Tabs>
    </div>
  )
}

const AssetsPage = () => {
  const {
    login,
    provider,
    walletProvider,
    web3Auth,
    isLoading,
    wagmiClient,
    logout,
  } = useWeb3Auth()
  const { logout: m3Logout } = useM3Auth()
  const { disconnect } = useConnect()
  const {
    ctrlConnection,
    selectWallet,
    delegationIdentity,
    userTokens,
    initProccess,
    userInfo,
    userCollections,
    contract,
    userInscriptions,
    privateKey,
  } = useSelector((state: RootState) => state.app)
  const { tokensConfig } = useSelector((state: RootState) => state.setting)
  const dispatch = useDispatch<RootDispatch>()
  // const [curTab, setCurTab] = useState('1')
  const [visible, setVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const selectNetwork = useSelector(
    (state: RootState) => state.app.selectNetwork
  )
  const [selectNetworkVisible, setSelectNetworkVisible] = useState(false)
  const [accountType, setAccountType] = useState<'aid' | 'pid'>('pid')
  const navigate = useNavigate()

  console.log('userTokens', userTokens)
  // console.log('provider', provider, userInfo, contract, userTokens, userCollections);
  let timer: string | number | NodeJS.Timeout | undefined
  useEffect(() => {
    getAssets()
    return () => {
      clearInterval(timer)
    }
  }, [])

  const getAssets = () => {
    timer = setInterval(() => {
      if (selectNetwork.network === 'bitcoin') {
        dispatch.app.getAllInscriptions({})
      }
      dispatch.app.getTokens({})
    }, 15000)
  }

  const receive = () => {
    setVisible2(true)
  }

  const switchNetwork = async (network: Chain) => {
    dispatch.app.switchNetwork(network)
    setSelectNetworkVisible(false)
  }

  // if (!selectWallet.address && !initProccess) {
  //   return (
  //     <div className="flex flex-col h-screen justify-center items-center">
  //       <NoticeBar content="The page requires address" color="alert" />
  //     </div>
  //   )
  // }

  return (
    <>
      <div className="app-body">
        <div className="grow" style={{ flex: '1 1' }}>
          <div className="-m-5 relative">
            {/* <img
              src={BANNER}
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              alt=""
            /> */}
            <div className="p-5">
              <div className="flex justify-between items-end mb-4">
                {selectNetwork.network === 'IC' ? (
                  <div className="flex-1">
                    {/* <div className="inline-flex text-xs font-bold text-center rounded-md overflow-hidden">
                      <div
                        onClick={() => setAccountType('aid')}
                        className={`${
                          accountType === 'aid'
                            ? 'bg-primary border border-primary text-black'
                            : 'border border-primary text-primary'
                        } px-3 rounded-tl-md rounded-bl-md`}
                      >
                        AID
                      </div>
                      <div
                        onClick={() => setAccountType('pid')}
                        className={`${
                          accountType === 'aid'
                            ? 'border border-primary text-primary'
                            : 'bg-primary border border-primary text-black'
                        } px-3 rounded-tr-md rounded-br-md`}
                      >
                        PID
                      </div>
                    </div> */}
                    <p className="text-xs">Card3 Principal ID</p>
                    <div className="flex items-center mt-1">
                      <h2 className="text-lg text-white leading-5 font-family-Mono">
                        {accountType === 'pid'
                          ? `${selectWallet.principal?.slice(
                              0,
                              5
                            )}...${selectWallet.principal?.slice(-4)}`
                          : `${selectWallet.address?.slice(
                              0,
                              5
                            )}...${selectWallet.address?.slice(-4)}`}
                      </h2>
                      <IconFont
                        className="ml-3"
                        name="fuzhi"
                        size={20}
                        color={'#fff'}
                        onClick={() => {
                          window.navigator.clipboard.writeText(
                            accountType === 'aid'
                              ? selectWallet.address!
                              : selectWallet.principal!
                          )
                          Toast.show('Copied!')
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-xss">Wallet Address</p>
                    <div className="flex items-center">
                      <h2 className="text-lg text-white leading-3 font-family-Mono">
                        {`${selectWallet.address?.slice(0, 5)}`}...
                        {selectWallet.address?.slice(-4)}
                      </h2>
                      <IconFont
                        className="ml-3"
                        name="fuzhi"
                        size={20}
                        color={'#fff'}
                        onClick={() => {
                          window.navigator.clipboard.writeText(
                            selectWallet.address
                          )
                          Toast.show('Copied!')
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex">
                  <div
                    className="flex font-bold border border-zinc-600 mr-2 items-center px-1 rounded-md1 text-white"
                    // onClick={() => setSelectNetworkVisible(true)}
                  >
                    <img
                      className="w-7 h-7 mr-1"
                      src={selectNetwork.iconUrl}
                      alt=""
                    />
                    {selectNetwork.name}
                  </div>
                  <MoreOutline
                    onClick={() => setVisible(true)}
                    className="rounded-md1 to-violet-500 from-fuchsia-500 bg-my-400 active:bg-primary"
                    color="#fff"
                    fontSize={36}
                  />
                </div>
              </div>
            </div>
          </div>

          {selectNetwork.network === 'bitcoin' ? (
            <>
              <p className="text-xs mb-2">Inscriptions</p>
              {userInscriptions.inscriptions.length > 0 ? (
                userInscriptions.inscriptions.map((inscription) => (
                  <div
                    className="w-2/3 rounded-md1 overflow-hidden mx-auto relative"
                    key={inscription.id}
                  >
                    <InscriptionView
                      className="w-full aspect-square	overflow-hidden"
                      inscription={inscription}
                    />
                  </div>
                ))
              ) : (
                <div className="rounded-md1 py-1 px-5 text-white font-bold bg-neutral-800">
                  No Inscription data
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-xs mb-2">NFT</p>

              <div className="relative ">
                {userCollections.collections.length > 0 ? (
                  userCollections.collections.map((collection) => (
                    <div
                      className="w-2/3 rounded-md1 overflow-hidden mx-auto relative"
                      key={collection.tokenIdentifier}
                    >
                      <p className="absolute w-full left-0 bg-my-400 text-white bottom-0 h-10 flex justify-between items-center px-5 leading-9">
                        <span>{collection.name}</span>
                        <h2 className="font-family-Mono text-2xl">
                          #{collection.token_id}
                        </h2>
                      </p>
                      <img
                        key={collection.imageUrl}
                        src={collection.imageUrl}
                        alt=""
                      />
                    </div>
                  ))
                ) : (
                  <div className="rounded-md1 py-1 px-5 text-white font-bold bg-neutral-800">
                    No NFT data
                  </div>
                )}
              </div>
            </>
          )}

          <p className="text-md mt-8 mb-2">Token</p>
          <List
            style={{
              '--border-top': '0',
              '--border-bottom': '0',
              '--border-inner': '0',
              '--padding-left': '0',
              '--padding-right': '0',
            }}
            className="relative"
          >
            <div
              className={`refreshing absolute right-0 -top-5 ${
                userTokens.isLoading ? 'spinAnimate' : ''
              }`}
              onClick={() => {
                dispatch.app.getTokens({})
              }}
            >
              <img src={REFRESH} className="h-4 w-4" alt="" />
            </div>
            {userTokens.tokens?.map((token) => (
              <List.Item
                key={token.name}
                prefix={
                  <img
                    className="h-14"
                    src={selectNetwork.network === 'IC' ? CK_BTC : TOKEN}
                    alt=""
                  />
                }
                // description={token.name}
                extra={
                  <div>
                    <p className="text-xl text-white font-family-Mono">
                      $ {token.balance_usd}
                    </p>
                    <p>
                      {
                        balanceToString(
                          BigInt(token.balance),
                          Number(token.digits)
                        ).formatTotalTo8
                      }
                    </p>
                  </div>
                }
              >
                <p className="text-white">{token.name}</p>
              </List.Item>
            ))}
          </List>
        </div>

        {isLoading ? (
          <div className="fixed w-full h-full top-0 left-0">
            <div className="flex justify-center flex-col items-center h-full">
              <SpinLoading color={'primary'} />
            </div>
          </div>
        ) : null}
      </div>
      <div className="app-bottom">
        {delegationIdentity ? (
          <div className="flex flex-row justify-end gap-2 mt-10">
            <Button
              color="default"
              style={{ backgroundColor: '#4A4A4F' }}
              className="w-20 h-20 flex justify-center items-center border-0"
              onClick={() => {
                if (userTokens.isLoading) return
                setVisible1(true)
              }}
            >
              {userTokens.isLoading ? (
                <DotLoading />
              ) : (
                <IconFont
                  name="jiantou"
                  color={'#fff'}
                  style={{ transform: 'rotate(0deg)' }}
                  size={36}
                />
              )}
            </Button>
            <Button
              color="default"
              style={{ backgroundColor: '#4A4A4F' }}
              className="w-20 h-20 flex justify-center items-center border-0"
              onClick={receive}
            >
              <IconFont
                name="jiantou"
                color={'#fff'}
                style={{ transform: 'rotate(180deg)' }}
                size={36}
              />
            </Button>
          </div>
        ) : null}
      </div>
      <Popup
        visible={visible1}
        onMaskClick={() => {
          setVisible1(false)
        }}
        style={{ background: '#23232F' }}
        bodyStyle={{
          minHeight: '40vh',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: 'hidden',
        }}
      >
        <div className=" p-6">
          <div className="flex items-center">
            <h2 className="text-2xl text-white mb-5 font-bold">
              Choose one to send
            </h2>
          </div>
          <List
            style={{
              '--border-top': '0',
              '--border-bottom': '0',
              '--border-inner': '0',
              '--padding-left': '0',
              '--padding-right': '0',
            }}
            className=""
          >
            {selectNetwork.network !== 'IC' &&
              userCollections.collections.map((collection) => (
                <List.Item
                  key={collection.token_id}
                  prefix={
                    <img
                      className="h-14 rounded-md1"
                      src={collection.imageUrl}
                      alt=""
                    />
                  }
                  description={<p>#{collection.token_id}</p>}
                  arrow
                  onClick={() => {
                    if (hasOwnProperty(contract?.status!, 'NEW')) {
                      navigate('/active')
                    } else {
                      if (selectNetwork.network === 'bitcoin') {
                        dispatch.setting.getFee({})
                      }
                      navigate(
                        `/send?sendType=nft&collectionId=${collection.token_id}`
                      )
                    }
                  }}
                >
                  <p className="text-white">{collection.name}</p>
                </List.Item>
              ))}
            {selectNetwork.network === 'bitcoin' &&
              userInscriptions.inscriptions.map((inscription) => (
                <List.Item
                  key={inscription.id}
                  prefix={
                    // <img className="h-14 rounded-md1" src={collection.imageUrl} alt="" />
                    <InscriptionView
                      className="h-14 w-14 rounded-md1"
                      inscription={inscription}
                    />
                  }
                  // description={<p>#{collection.token_id}</p>}
                  arrow
                  onClick={() => {
                    if (hasOwnProperty(contract?.status!, 'NEW')) {
                      navigate('/active')
                    } else {
                      if (selectNetwork.network === 'bitcoin') {
                        dispatch.setting.getFee({})
                      }
                      navigate(
                        `/send?sendType=nft&collectionId=${inscription.id}`
                      )
                    }
                  }}
                />
              ))}
            {userTokens.tokens?.map((token) => (
              <List.Item
                key={token.name}
                prefix={
                  <img
                    className="h-14 rounded-md1"
                    src={selectNetwork.network === 'IC' ? CK_BTC : TOKEN}
                    alt=""
                  />
                }
                description={
                  <p>
                    {
                      balanceToString(
                        BigInt(token.balance),
                        Number(token.digits)
                      ).formatTotalTo8
                    }
                    {token.symbol}
                  </p>
                }
                arrow
                onClick={() => {
                  if (hasOwnProperty(contract?.status!, 'NEW')) {
                    navigate('/active')
                  } else {
                    if (selectNetwork.network === 'bitcoin') {
                      dispatch.setting.getFee({})
                    }
                    navigate('/send?sendType=token')
                  }
                }}
              >
                <p className="text-white">{token.name}</p>
              </List.Item>
            ))}
          </List>
        </div>
      </Popup>
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false)
        }}
        style={{ background: '#23232F' }}
        bodyStyle={{
          minHeight: '40vh',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: 'hidden',
        }}
      >
        <div className=" p-6">
          <div
            className="mt-5 rounded-md1 bg-black text-white text-lg font-bold flex justify-between items-center p-5"
            onClick={async () => {
              if (process.env.LOGIN_TYPE === 'ic') {
                await disconnect()
              } else if (process.env.LOGIN_TYPE === 'm3') {
                await m3Logout()
              } else {
                await logout()
              }
              window.location.reload()
            }}
          >
            Log out
            <IconFont name="exit" color={'#fff'} size={22} />
          </div>
        </div>
      </Popup>

      <Popup
        visible={visible2}
        onMaskClick={() => {
          setVisible2(false)
        }}
        style={{ background: '#23232F' }}
        bodyStyle={{
          minHeight: '40vh',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: 'hidden',
        }}
      >
        <ReceiveComponent selectWallet={selectWallet} />
      </Popup>
      <Popup
        onMaskClick={() => setSelectNetworkVisible(false)}
        visible={selectNetworkVisible}
        style={{ background: '#23232F' }}
        bodyStyle={{
          minHeight: '40vh',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: 'hidden',
        }}
      >
        <div className=" p-6">
          <div className="flex items-center">
            <h2 className="text-2xl text-white mb-5 font-bold">
              Select network
            </h2>
          </div>
          <List
            style={{
              '--border-top': '0',
              '--border-bottom': '0',
              '--border-inner': '0',
              '--padding-left': '0',
              '--padding-right': '0',
            }}
            className=""
          >
            {[defaultNetwork, ...otherNetworks].map((network: any) => (
              <List.Item
                className={`mb-1 p-1 rounded-md1 ${
                  selectNetwork.network === network.network ? 'bg-black' : ''
                }`}
                key={network.name}
                prefix={
                  <img
                    className="h-16 rounded-md1"
                    src={network.network === 'IC' ? ICP : TOKEN}
                    alt=""
                  />
                }
                onClick={() => {
                  switchNetwork(network)
                }}
                arrow={false}
                extra={
                  <div className="flex justify-center items-cente mr-3">
                    {selectNetwork.network === network.network ? (
                      <div className="bg-violet-500 flex justify-center items-center h-6 w-6 rounded">
                        <img src={CHECK} className="h-6" alt="" />
                      </div>
                    ) : null}
                  </div>
                }
              >
                <p className="text-white">{network.name}</p>
              </List.Item>
            ))}
          </List>
        </div>
      </Popup>
    </>
  )
}

export default AssetsPage
