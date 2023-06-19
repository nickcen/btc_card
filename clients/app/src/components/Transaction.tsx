import {
  Space,
  Image,
  Divider,
  Steps,
  Button,
  Card,
  Dialog,
  List,
  CheckList,
  DotLoading,
  Toast,
  Popup,
} from 'antd-mobile'
import {
  forwardRef,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BigNumber, ethers } from 'ethers'
import {
  erc20ABI,
  fetchSigner,
  getClient,
  getNetwork,
  getProvider,
  prepareSendTransaction,
  PrepareSendTransactionResult,
  prepareWriteContract,
  PrepareWriteContractResult,
  sendTransaction,
  SendTransactionResult,
  writeContract,
} from '@wagmi/core'
import {
  ArrowDownCircleOutline,
  CheckOutline,
  MinusOutline,
} from 'antd-mobile-icons'
import Back from './Back'
import { DelegationIdentity } from '@dfinity/identity'
import { RootDispatch, RootState } from 'srcPath/store'
import { useNavigate } from 'react-router-dom'
import IconFont from './iconfont'
import { ICSCANNFTDetail, UserToken } from 'srcPath/utils/assets'
import { contractsAddress } from 'srcPath/config/constants'
import { CK_BTC, HOME, TOKEN, VIEW } from 'srcPath/utils/resource'
import { parseFixed } from '@ethersproject/bignumber'
import { getIdl, getMethods } from 'srcPath/utils/tokens'
import { fromHexString } from '@dfinity/candid'
import {
  balanceFromString,
  balanceToString,
  principalToAccountIdentifier,
  stringToAccountIdentifier,
  validateCanisterId,
} from 'srcPath/utils/converter'
import { Principal } from '@dfinity/principal'
import {
  sendArgsBuilder,
  TransactionResponse,
} from 'srcPath/services/ledgerConnection'
import { createProxyActor } from 'srcPath/services/proxyActor'
import {
  getICPTransactionsByBlock,
  getTransactionFromRosseta,
  InferredTransaction,
} from 'srcPath/services/history/rosseta'
import CONFIRM from 'srcPath/assets/images/confirm.svg'
import { ordService } from 'srcPath/utils'
import { TXSendBTC } from 'srcPath/services/ord'
import InscriptionView from './Inscription'
import { SendResponse } from 'srcPath/utils/tokens/methods'

export type TransactionTokenType = {
  contractAddress: string
  amount: string
  to: string
  from: string
  sendOpts?: any
}

export type TransactionCollectionType = {
  token_id?: number
  contractAddress: string
  to: string
  from: string
  inscription_id?: string
}

export type TransactionConfirmProps = {
  type: 'auth' | 'transfer'
  back: () => void
  sendParams: TransactionTokenType | TransactionCollectionType
  onTokenSuccess: (response?: TransactionResponse) => void
  onCollectionSuccess: () => void
}

export type TransactionConfirmRef = {
  doTransaction: () => void
  doCollectionTransaction: () => void
}

let gasEstTimer: string | number | NodeJS.Timeout | undefined,
  getHistoryTimer: string | number | NodeJS.Timeout | undefined

const Transaction = forwardRef<TransactionConfirmRef, TransactionConfirmProps>(
  (props, ref) => {
    const [viewType, setViewType] = useState<
      'confirm' | 'sended' | 'gasFeeConfig'
    >('confirm')
    const [transactionStatus, setTransactionStatus] = useState<number>(0)
    const { tokens: userTokens } = useSelector(
      (state: RootState) => state.app.userTokens
    )
    const { collections: userCollections } = useSelector(
      (state: RootState) => state.app.userCollections
    )
    const { userInscriptions } = useSelector((state: RootState) => state.app)
    const currentToken = userTokens.find(
      (token: { contractAddress: string }) =>
        token.contractAddress ===
        (props.sendParams as TransactionTokenType)?.contractAddress
    ) as UserToken
    const currentCollection = userCollections.find(
      (collection) =>
        collection.token_id ===
        (props.sendParams as TransactionCollectionType)?.token_id
    ) as ICSCANNFTDetail
    const currentInscription = userInscriptions.inscriptions.find(
      (inscription) =>
        inscription.id ===
        (props.sendParams as TransactionCollectionType).inscription_id
    )
    const {
      selectWallet,
      selectNetwork,
      cardConnection,
      ordCanisterSigner,
    } = useSelector((state: RootState) => state.app)
    const { gasEstimate, chainBrowserConfig, feeOptions, selectFeeIndex } =
      useSelector((state: RootState) => state.setting)
    const loading = useSelector(
      (state: RootState) => state.loading.models.setting
    )
    const { from: fromAddress, to: toAddress } = props.sendParams
    const [sending, setSending] = useState(false)
    const transactionPreConfigRef = useRef<
      PrepareSendTransactionResult | PrepareWriteContractResult
    >()
    const [curGasMode, setCurGasMode] = useState('Proposed')
    const [visible1, setVisible1] = useState(false)
    const { onTokenSuccess } = props
    const dispatch = useDispatch<RootDispatch>()
    const transactionHistoryRef = useRef<
      { hash: `0x${string}` } | InferredTransaction | TXSendBTC
    >()
    const navigate = useNavigate()
    const [utxos, setUtxos] = useState<any>([])
    const retryHistoryRef = useRef<number>(0)
    const maxRetryHistory = 3

    const curGasModeparsm =
      gasEstimate &&
      gasEstimate[selectNetwork.network]?.gasPriceEstimate.gasMode.find(
        (o: { speed: string }) => o.speed === curGasMode
      )
    console.log('render Transaction', transactionStatus)
    useImperativeHandle(ref, () => ({
      doTransaction: async () => {
        await doEthTransaction()
      },
      doCollectionTransaction: async () => {
        await doCollectionTransaction()
      },
    }))

    useEffect(() => {
      if (selectNetwork.network !== 'IC') {
        if (selectNetwork.network === 'bitcoin') {
          getUtxo()
        } else {
          gasEstPreSendTransaction()
        }
      }
      return () => {
        clearInterval(gasEstTimer)
        clearInterval(getHistoryTimer)
      }
    }, [])

    const gasEstPreSendTransaction = async () => {
      if (currentToken && !currentCollection) {
        const amount = (props.sendParams as TransactionTokenType).amount
        if (selectNetwork.nativeCurrency.symbol === currentToken.symbol) {
          transactionPreConfigRef.current = await prepareSendTransaction({
            request: {
              to: toAddress || fromAddress,
              value: ethers.utils.parseUnits(amount, currentToken.digits),
            },
          })
          // transactionPreConfigRef.current = undefined
        }

        dispatch.setting.getGasEstimate({
          currentToken,
          gasLimitRep:
            transactionPreConfigRef.current?.request.gasLimit.toString(),
        })
        clearInterval(gasEstTimer)
        gasEstTimer = setInterval(() => {
          dispatch.setting.getGasEstimate({
            currentToken,
            gasLimitRep:
              transactionPreConfigRef.current?.request.gasLimit.toString(),
          })
        }, 15000)
      }
    }

    const getUtxo = async () => {
      const utxos = await ordService.getAddressUtxo(fromAddress)
      setUtxos(utxos)
      console.log('utxos', utxos)
    }

    const doCollectionTransaction = async () => {
      console.log('doCollectionTransaction')
      try {
        setSending(true)
        console.log('utxos', utxos)
        const params = {
          to: toAddress,
          id: currentInscription?.id!,
          fee: feeOptions[selectFeeIndex].fee,
        }
        console.log('params', params)
        const tx = await ordCanisterSigner?.sendInscription(params)
        transactionHistoryRef.current = tx
        setViewType('sended')
        setTransactionStatus(3)
        clearInterval(gasEstTimer)
        setSending(false)
      } catch (err: any) {
        setSending(false)
        clearInterval(gasEstTimer)
        navigate('/error', {
          state: {
            title: 'Transaction failed.',
            detail: err.message,
          },
        })
        console.log('err', err)
      }
    }

    const doEthTransaction = async () => {
      if (transactionPreConfigRef.current === undefined) {
        console.log(transactionPreConfigRef.current)
        return
      }
      try {
        setSending(true)
        const gasEstimateParams = curGasModeparsm
        const maxPriorityFeePerGas = BigInt(
          Number(
            gasEstimateParams?.maxPriorityFeePerGas! * Math.pow(10, 9)
          ).toFixed()
        )
        const maxFeePerGas = BigInt(
          Number(gasEstimateParams?.maxFeePerGas! * Math.pow(10, 9)).toFixed(0)
        )
        if (currentToken.symbol === selectNetwork.nativeCurrency.symbol) {
          console.log('maxPriorityFeePerGas', maxPriorityFeePerGas)
          console.log('maxFeePerGas', maxFeePerGas)
          console.log('gasEstimateParams', gasEstimateParams)
          const params = {
            ...transactionPreConfigRef.current!,
            // ...gasEstimateParams,
            request: {
              ...transactionPreConfigRef.current.request,
              gasLimit: BigInt(40000),
              maxPriorityFeePerGas: maxPriorityFeePerGas,
              maxFeePerGas: maxFeePerGas,
              // gasPrice: gasEstimateFormat?.maxFeePerGas as BigNumber,
            },
          }
          console.log('params===', params, getProvider(), getClient())
          console.log(
            'params===1',
            gasEstimate && gasEstimate[selectNetwork.network]
          )
          const { hash } = await sendTransaction(params)
          console.log('hash', hash)
          transactionHistoryRef.current = { hash }
          clearInterval(gasEstTimer)
        } else {
          const { hash } = await writeContract(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            {
              ...(transactionPreConfigRef.current as PrepareWriteContractResult),
              ...gasEstimateParams,
            }
          )
          console.log('hash', hash)
          transactionHistoryRef.current = { hash }
          clearInterval(gasEstTimer)
        }
        setSending(false)
        setViewType('sended')
        setTransactionStatus(3)
        onTokenSuccess()
        clearInterval(gasEstTimer)
      } catch (err: any) {
        setSending(false)
        clearInterval(gasEstTimer)
        navigate('/error', {
          state: {
            title: 'Transaction failed.',
            detail: err.message,
          },
        })
      }
    }

    const doBTCTransaction = async () => {
      const { amount } = props.sendParams as TransactionTokenType
      if (fromAddress === undefined || amount === undefined) {
        throw new Error('Cannot get main account address or amount')
      }
      try {
        setSending(true)
        console.log('utxos', utxos)
        const params = {
          to: toAddress,
          amount: Number(balanceFromString(amount, 8)),
          utxos,
          autoAdjust: false,
          feeRate: feeOptions[selectFeeIndex].fee,
        }
        console.log('params', params)
        const tx = await ordCanisterSigner?.sendBTC(params)
        console.log('tx', tx)
        transactionHistoryRef.current = tx
        setSending(false)
        setViewType('sended')
        setTransactionStatus(3)
        onTokenSuccess()
      } catch (err: any) {
        setSending(false)
        navigate('/error', {
          state: {
            title: 'Transaction failed.',
            detail: err.message,
          },
        })
      }
    }

    const doICPTransaction = async () => {
      const { amount } = props.sendParams as TransactionTokenType
      if (fromAddress === undefined || amount === undefined) {
        throw new Error('Cannot get main account address or amount')
      }
      const toAccountID = validateCanisterId(toAddress)
        ? principalToAccountIdentifier(Principal.fromText(toAddress))
        : stringToAccountIdentifier(toAddress)!
      try {
        let result: TransactionResponse | SendResponse | string | undefined
        // 都是OMNI 交易
        setSending(true)
        if (currentToken?.symbol === 'ICP') {
          const sendParams = {
            account_id: Array.from(new Uint8Array(fromHexString(toAccountID))),
            from_subaccount: [] as [],
            memo:
              (props.sendParams as TransactionTokenType).sendOpts?.memo ?? [],
            amount: {
              e8s: balanceFromString(amount, Number(currentToken.digits)),
            },
          }
          console.log('sendParams', sendParams)
          try {
            const sendArgs = sendArgsBuilder({
              to: toAccountID,
              amount: balanceFromString(amount, Number(currentToken.digits)),
              sendOpts: {
                fee: BigInt(10000),
                memo: (props.sendParams as TransactionTokenType).sendOpts?.memo,
                created_at_time: new Date(Date.now()),
                from_subaccount: (props.sendParams as TransactionTokenType)
                  .sendOpts?.from_subaccount,
              },
            })
            const blockHeight = (await cardConnection?.icpSend(
              sendParams
            )) as string
            result = {
              blockHeight: blockHeight,
              sendArgs,
            } as unknown as TransactionResponse
          } catch (err) {
            setSending(false)
            console.log('err', err)
            result = undefined
          }
        } else {
          const omniActor = cardConnection?.actor
          const idl = getIdl(currentToken.standard)
          const methods = getMethods(currentToken.standard)
          const proxyActor = await createProxyActor(
            omniActor!,
            currentToken.contractAddress,
            idl,
            methods
          )
          const sendParams = {
            to: toAddress,
            from: fromAddress,
            amount: balanceFromString(amount, Number(currentToken.digits)),
            opts: {
              ...(props.sendParams as TransactionTokenType).sendOpts,
              memo: (props.sendParams as TransactionTokenType).sendOpts?.memo,
            },
          }
          console.log('sendParams', sendParams, proxyActor)
          result = (await proxyActor.send(sendParams, true)) as SendResponse
          console.log('proxyActor send result ', result)
        }

        //处理结果
        if (result !== undefined) {
          setTransactionStatus(1)
          if (currentToken.symbol === 'ICP') {
            await transactionHistory(result as TransactionResponse)
          } else {
            setTransactionStatus(3)
            setViewType('sended')
            onTokenSuccess(result as unknown as any)
            setSending(false)
          }
        } else {
          setTransactionStatus(0)
          setViewType('sended')
          setSending(false)
        }
      } catch (err: any) {
        navigate('/error', {
          state: {
            title: 'Transaction failed.',
            detail: err.message,
          },
        })
      }
    }

    const transactionHistory = async (response?: TransactionResponse) => {
      try {
        console.log('transactionHistory', response)
        console.log('icpByBlock start')
        const icpByBlock = await getICPTransactionsByBlock(
          fromAddress,
          (response as TransactionResponse).blockHeight
        )
        console.log('icpByBlock end', icpByBlock, fromAddress, response!)
        const txRosseta = getTransactionFromRosseta(
          fromAddress,
          response!,
          icpByBlock
        )
        if (txRosseta == undefined || txRosseta?.hash === '') {
          setTransactionStatus(2)
          console.log('transaction done', txRosseta)
        } else {
          setTransactionStatus(3)
          console.log('transaction done', txRosseta)
        }
        transactionHistoryRef.current = txRosseta
        console.log('txRosseta', txRosseta)
        setViewType('sended')
        setSending(false)
        clearInterval(getHistoryTimer)
        onTokenSuccess(txRosseta as any)
      } catch (err) {
        console.log('transactionHistory retry', response, err)
        clearInterval(getHistoryTimer)
        getHistoryTimer = setInterval(async () => {
          if (retryHistoryRef.current < maxRetryHistory) {
            transactionHistory(response)
            retryHistoryRef.current = retryHistoryRef.current + 1
          } else {
            setTransactionStatus(1)
            setViewType('sended')
            setSending(false)
          }
        }, 1000)
      }
    }

    const handleSend = () => {
      if (viewType === 'sended') {
        navigate('/assets')
      } else {
        if (currentInscription) {
          doCollectionTransaction()
        } else {
          if (selectNetwork.network === 'IC') {
            doICPTransaction()
          } else if (selectNetwork.network === 'bitcoin') {
            doBTCTransaction()
          } else {
            doEthTransaction()
          }
        }
      }
    }

    const back = () => {
      if (viewType === 'sended') {
        if (props.type === 'auth') {
          props.back()
        } else {
          navigate(-1)
        }
      } else if (viewType === 'gasFeeConfig') {
        setViewType('confirm')
      } else {
        props.back()
      }
    }

    const ConfirmView = () => {
      return (
        <>
          <h1 className="font-bold text-2xl mb-10 whitespace-pre-wrap text-white">
            Confirm Transaction
          </h1>
          <div className="relative">
            {/* <div className='absolute right-1/2 bottom-1/2 z-10 rounded-2xl overflow-hidden bg-white translate-x-3 translate-y-3'>
            <ArrowDownCircleOutline fontSize={24}  />
          </div> */}
            <div className="px-2 bg_brand inline-block text-black h-3 rounded-sm text-xss font-bold leading-3">
              From:
            </div>
            <h2 className="text-white break-all font-family-Mono">
              {selectWallet.address}
            </h2>
            <div className="flex relative my-4">
              <div
                className="rounded-sm h-6 w-6 flex justify-center items-center z-10"
                style={{ backgroundColor: '#4a4a4f' }}
              >
                <IconFont
                  name="fanhui"
                  color={'#0b0b0b'}
                  style={{ transform: 'rotate(-90deg)' }}
                  size={12}
                />
              </div>
              <div
                className="w-full absolute left-0 top-2/4 translate-y-1/2"
                style={{ backgroundColor: '#4a4a4f', height: '2px' }}
              ></div>
            </div>
            <div className="px-2 bg_brand inline-block text-black h-3 rounded-sm text-xss font-bold leading-3">
              To:
            </div>
            <h2 className="text-white break-all font-family-Mono">
              {toAddress}
            </h2>
          </div>
          {currentToken ? (
            <>
              {currentCollection ? (
                <div
                  className="p-1 rounded-xl flex items-center mt-10"
                  style={{ backgroundColor: '#4a4a4f' }}
                >
                  <img
                    className="w-14 h-14 rounded-md mr-2"
                    src={currentCollection?.imageUrl}
                    alt=""
                  />
                  <div>
                    <p className="text-white text-lg">
                      {currentCollection?.name}
                    </p>
                    <p className="text-white text-md">
                      #{currentCollection?.token_id}
                    </p>
                  </div>
                </div>
              ) : currentInscription ? (
                <>
                  <div className="flex justify-center  mt-10">
                    <div className="bg-3a3a rounded-xl pt-3 overflow-hidden">
                      <InscriptionView
                        className="mx-auto mb-2"
                        inscription={currentInscription}
                        alt=""
                      />
                      <p className="bg-5d5d px-2 text-primary">
                        #{currentInscription?.number}
                      </p>
                    </div>
                  </div>
                  {/* <p className="text-xs mt-10">Amount:</p>
                  <p className="text-xl text-white font-family-Mono">{`${(
                    props.sendParams as TransactionTokenType
                  ).amount!} ${currentToken.symbol}`}</p> */}
                </>
              ) : (
                <>
                  <p className="text-xs mt-10">Amount:</p>
                  <p className="text-xl text-white font-family-Mono">{`${(
                    props.sendParams as TransactionTokenType
                  ).amount!} ${currentToken.symbol}`}</p>
                </>
              )}
              {selectNetwork.network === 'IC' ? (
                <>
                  {Number(currentToken.serviceCharge) !== 0 ? (
                    <>
                      <p className="mt-3 text-xs">Transaction Fee: </p>
                      <div className="text-white font-bold text-lg">
                        {
                          balanceToString(
                            BigInt(currentToken.serviceCharge),
                            currentToken.digits
                          ).formatTotal
                        }{' '}
                        {currentToken?.symbol}
                      </div>
                    </>
                  ) : null}
                </>
              ) : selectNetwork.network === 'bitcoin' ? (
                <></>
              ) : (
                <>
                  <div
                    className="my-4 rounded-md1"
                    onClick={() => setVisible1(true)}
                  >
                    <div className="flex-row flex items-center">
                      <div className="flex-1">
                        <p className="text-xs">Gas(estimated)</p>
                        <div className="text-white">
                          Max fee:{' '}
                          {curGasModeparsm ? (
                            curGasModeparsm.gasFee
                          ) : (
                            <DotLoading />
                          )}{' '}
                          {selectNetwork.nativeCurrency.symbol}
                        </div>
                      </div>
                      <div
                        className="flex items-center rounded-sm py-1 px-2"
                        style={{ border: '1px solid #3A3A49' }}
                      >
                        <div className="font-bold c_brand">
                          {curGasModeparsm?.speed}
                        </div>
                        <IconFont
                          name="tiaozhuanbeifen"
                          size={22}
                          className="ml-2"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {currentInscription ? null : (
                <>
                  <p className="text-xs mt-3">Total:</p>
                  {currentCollection ? (
                    <>
                      <p className="text-white">
                        {curGasModeparsm?.gasFee}{' '}
                        {selectNetwork.nativeCurrency.symbol}
                      </p>
                    </>
                  ) : (
                    <>
                      {selectNetwork.network === 'IC' ? (
                        <p className="text-white">
                          {
                            balanceToString(
                              balanceFromString(
                                (props.sendParams as TransactionTokenType)
                                  .amount,
                                currentToken.digits
                              ) + BigInt(currentToken.serviceCharge),
                              currentToken.digits
                            ).formatTotal
                          }
                          {currentToken.symbol}
                        </p>
                      ) : (
                        <p className="text-white">
                          {`${(props.sendParams as TransactionTokenType)
                            .amount!} ${currentToken.symbol} ${
                            curGasModeparsm?.gasFee
                              ? `${curGasModeparsm?.gasFee} ${selectNetwork.nativeCurrency.symbol}`
                              : ''
                          }`}
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          ) : null}
        </>
      )
    }

    const SendedView = () => {
      return (
        <>
          <Space style={{ '--gap-horizontal': '10px' }} className="mb-2 mt-16">
            <h1 className="text-2xl text-white font-bold">
              Transaction Status
            </h1>
          </Space>
          {!currentCollection && !currentInscription ? (
            <>
              <div
                className="p-1 rounded-md1 flex items-center mb-16"
                style={{ backgroundColor: '#4a4a4f' }}
              >
                <img
                  className="w-14 h-14 rounded-md1 mr-2"
                  src={selectNetwork.network === 'IC' ? CK_BTC : TOKEN}
                  alt=""
                />
                <div>
                  <p className="text-white text-lg">{currentToken?.name}</p>
                  <p
                    className="text-white text-md"
                    style={{ color: '#9C9CA4' }}
                  >
                    {(props.sendParams as TransactionTokenType).amount}{' '}
                    {currentToken.symbol}
                  </p>
                </div>
              </div>
            </>
          ) : currentInscription ? (
            <>
              <div className="flex justify-center  mt-10">
                <div className="bg-3a3a rounded-xl pt-3 overflow-hidden">
                  <InscriptionView
                    className="mx-auto mb-2"
                    inscription={currentInscription}
                    alt=""
                  />
                  <p className="bg-5d5d px-2 text-primary">
                    #{currentInscription?.number}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className="p-1 rounded-md1 flex items-center mb-16"
                style={{ backgroundColor: '#4a4a4f' }}
              >
                <img
                  className="w-14 h-14 rounded-md1 mr-2"
                  src={currentCollection?.imageUrl}
                  alt=""
                />
                <div>
                  <p className="text-white text-lg">
                    {currentCollection?.name}
                  </p>
                  <p className="text-white text-md">
                    #{currentCollection?.token_id}
                  </p>
                </div>
              </div>
            </>
          )}
          <Steps
            direction="vertical"
            className="transaction-status mt-10"
            current={transactionStatus}
            style={{ padding: '8px 0', marginBottom: 75 }}
          >
            <Steps.Step
              title={'Connection initialized'}
              icon={
                <div className="h-6 w-6 flex justify-center items-center bg-gradient-to-br rounded to-violet-500 from-fuchsia-500">
                  <CheckOutline color="#fff" />
                </div>
              }
            />
            <Steps.Step
              title={
                transactionStatus === 0
                  ? 'Transaction failed.'
                  : 'Transaction sent.'
              }
              icon={
                transactionStatus !== 3 ? (
                  <div className="h-6 w-6 flex justify-center items-center rounded bg-red-500 ">
                    <MinusOutline color="#fff" />
                  </div>
                ) : (
                  <div className="h-6 w-6 flex justify-center items-center rounded  bg-gradient-to-br  to-violet-500 from-fuchsia-500">
                    <CheckOutline color="#fff" />
                  </div>
                )
              }
            />
            <Steps.Step
              title={'Success'}
              icon={
                transactionStatus === 3 ? (
                  <div className="h-6 w-6 flex justify-center items-center bg-gradient-to-br rounded to-violet-500 from-fuchsia-500">
                    <CheckOutline color="#fff" />
                  </div>
                ) : (
                  <div className="h-6 w-6 flex justify-center items-center rounded bg-zinc-600"></div>
                )
              }
            />
          </Steps>
        </>
      )
    }

    const GasFeeView = () => {
      return (
        <>
          <h1 className="text-2xl text-white mb-5">Edit Gas Fee</h1>
          <List
            className="rounded-xl"
            style={{
              '--border-bottom': '0',
              '--border-top': '0',
              '--border-inner': '0',
            }}
          >
            {gasEstimate &&
              gasEstimate[selectNetwork.network].gasPriceEstimate.gasMode?.map(
                (
                  gasMode: { gasFee: any; speed: any; time: any },
                  index: number
                ) => (
                  <List.Item
                    className={`${
                      gasMode.speed === curGasMode ? 'bg-black' : ''
                    } rounded-xl `}
                    arrow
                    key={index}
                    // extra={
                    //   <div className="flex align-items-center font_size_md">
                    //     <div className="flex-1 main-color-text">
                    //       {gasMode.gasFee} {selectNetwork.nativeCurrency.symbol}
                    //     </div>
                    //     <IconFont
                    //       name="select"
                    //       color={
                    //         gasMode.speed === curGasMode ? '#1677ff' : '#5c5c5c'
                    //       }
                    //       size={20}
                    //       className="mg_l_10"
                    //     />
                    //   </div>
                    // }
                    onClick={() => {
                      setCurGasMode(gasMode.speed)
                      setVisible1(false)
                    }}
                  >
                    <p className="text-white text-lg font-bold">
                      {gasMode.speed}
                    </p>
                    <p className="text-sm">
                      Likely in &gt; {gasMode?.time} sec {gasMode.gasFee}{' '}
                      {selectNetwork.nativeCurrency.symbol}
                    </p>
                  </List.Item>
                )
              )}
          </List>
        </>
      )
    }

    return (
      <>
        <div className="app-body">
        
          {transactionStatus === 3 ? null : <Back back={back} />}
          {viewType === 'confirm' ? <ConfirmView /> : <SendedView />}
        </div>
        <div className="app-bottom">
          {transactionStatus === 3 ? (
            <div className={`flex justify-end gap-2`}>
              <img
                src={HOME}
                alt=""
                onClick={() => {
                  if (currentCollection) {
                    props.onCollectionSuccess()
                  }
                  clearInterval(gasEstTimer)
                  clearInterval(getHistoryTimer)
                  navigate('/assets')
                }}
              />
              {selectNetwork.network === 'IC' &&
              selectNetwork.nativeCurrency.symbol !==
                currentToken.symbol ? null : (
                <a
                  href={
                    selectNetwork.network === 'bitcoin'
                      ? `https://blockstream.info/tx/${
                          (transactionHistoryRef.current as TXSendBTC).txId
                        }`
                      : `${(
                          chainBrowserConfig[selectNetwork.network]?.hash?.find(
                            (o) => o.selected
                          ) ??
                          (chainBrowserConfig[selectNetwork.network]?.hash &&
                            chainBrowserConfig[selectNetwork.network]?.hash[0])
                        )?.url.replace(
                          '{txHash}',
                          (transactionHistoryRef.current as any)?.hash
                        )}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={VIEW} alt="" />
                </a>
              )}
            </div>
          ) : viewType === 'gasFeeConfig' ? null : (
            <div className="mt-10 flex justify-end">
              {viewType === 'confirm' && !sending ? (
                <img
                  src={CONFIRM}
                  className="h-20 w-20"
                  alt=""
                  onClick={handleSend}
                />
              ) : (
                <Button
                  className="w-20 h-20 flex justify-center items-center"
                  color="primary"
                  onClick={handleSend}
                  loading={sending || loading}
                  disabled={sending || loading}
                >
                  <div className="flex flex-col justify-center items-center">
                    <IconFont
                      name="jiantou"
                      color={'#fff'}
                      style={{ transform: 'rotate(0deg)' }}
                      size={36}
                    />
                    <span className="text-xss">
                      {sending ? 'Sending' : 'Close'}
                    </span>
                  </div>
                </Button>
              )}
            </div>
          )}
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
            <GasFeeView />
          </div>
        </Popup>
      </>
    )
  }
)

export default Transaction
