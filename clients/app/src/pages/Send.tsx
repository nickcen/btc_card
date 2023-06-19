import { RootDispatch, RootState } from 'srcPath/store'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, Form, Input, List, Mask, TextArea } from 'antd-mobile'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { getAddressFormat, UserToken } from 'srcPath/utils/assets'
import { useEffect, useRef, useState } from 'react'
import {
  AddressType,
  balanceFromString,
  balanceToString,
  getAddressType,
} from 'srcPath/utils/converter'
import IconFont from 'srcPath/components/iconfont'
import { floatNumberRegex, numberRegex } from 'srcPath/utils/reg'
import Back from 'srcPath/components/Back'
import Transaction from 'srcPath/components/Transaction'
import { getClient, getProvider } from '@wagmi/core'
import { DownOutline } from 'antd-mobile-icons'
import InscriptionView from 'srcPath/components/Inscription'

const SendPage = () => {
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const sendType = searchParams.get('sendType')
  const collectionId = searchParams.get('collectionId')
  const {
    selectNetwork,
    selectWallet,
    provider,
    userCollections,
    userInscriptions,
    delegationIdentity,
  } = useSelector((state: RootState) => state.app)
  const { tokens: userTokens } = useSelector(
    (state: RootState) => state.app.userTokens
  )
  const currentToken = userTokens.find((token: { symbol: any }) =>
    selectNetwork.network === 'IC'
      ? token.symbol === 'ckBTC'
      : token.symbol === selectNetwork.nativeCurrency.symbol
  ) as UserToken
  const currentNFT = userCollections.collections.find(
    (collection) => collection.token_id.toString() === collectionId!
  )

  const currentInscription = userInscriptions.inscriptions.find(
    (inscription) => inscription.id === collectionId
  )
  const [feeVisabled, setFeeVisabled] = useState(false)
  const [form] = Form.useForm()
  const [selectedToken, setSelectedToken] = useState<UserToken>(currentToken)
  const { feeOptions, selectFeeIndex } = useSelector(
    (state: RootState) => state.setting
  )
  const [visible, setVisible] = useState(false)
  const [disableSend, setDisableSend] = useState(true)
  const [viewType, setViewType] = useState<'input' | 'confirm'>('input')
  const navigate = useNavigate()
  const formValueRef = useRef<{ amount: string; toAddress: string }>()
  const dispatch = useDispatch<RootDispatch>()
  const [customInscriptionSats, setCustomInscriptionSats] = useState(false)

  const addressFormat = getAddressFormat(selectedToken?.standard)
  if (delegationIdentity === null || !currentToken) {
    return null
  }

  console.log('addressFormat======', addressFormat)
  console.log('selectNetwork======', selectNetwork, feeOptions, selectFeeIndex)

  const checkAddress = (_: any, value: string) => {
    if (selectNetwork.network === 'IC') {
      const stringType = getAddressType(value)
      if (addressFormat.principal && addressFormat.accountId) {
        if (
          stringType === AddressType.ACCOUNT ||
          stringType === AddressType.PRINCIPAL ||
          stringType === AddressType.CANISTER
        ) {
          return Promise.resolve()
        }
        return Promise.reject(
          new Error('Account Id or Principal Id is not valid.')
        )
      }
      if (addressFormat.principal) {
        if (
          stringType === AddressType.PRINCIPAL ||
          stringType === AddressType.CANISTER
        ) {
          return Promise.resolve()
        }
        return Promise.reject(new Error('Principal Id is not valid.'))
      }
      return Promise.reject(
        new Error('Account Id or Principal Id is not valid.')
      )
    } else if (selectNetwork.network === 'bitcoin') {
      return Promise.resolve()
    } else {
      if (/^0x\w+/.test(value)) {
        return Promise.resolve()
      } else {
        return Promise.reject(new Error('Incorrect address(0x)'))
      }
    }
  }

  const checkForm = async () => {
    try {
      const result = await form.validateFields()
      setDisableSend(false)
      console.log('result', result)
    } catch (err) {
      setDisableSend(true)
    }
    // .then(() => {
    //   setDisableSend(false)
    // }).catch(() => {
    //   setDisableSend(true)
    // })
  }

  const handleSubmit = async () => {
    const values = form.getFieldsValue()
    // formValueRef.current = {
    //   ...values,
    //   amount: sendType === 'nft' && selectNetwork.network === 'bitcoin' && !customInscriptionSats ? '0.0001' : values.amount,
    // }
    formValueRef.current = values
    setViewType('confirm')
  }

  const handleSelectToken = (select: UserToken) => {
    const token = userTokens.find(
      (t) => t.contractAddress === select.contractAddress
    ) as UserToken
    setSelectedToken(token)
    if (form.getFieldValue('amount')) {
      form.validateFields(['amount'])
    }
    setVisible(false)
  }

  if (viewType === 'confirm') {
    return (
      <Transaction
        type="transfer"
        back={() => {
          setViewType('input')
        }}
        onTokenSuccess={async () => {
          dispatch.app.getTokens({})
        }}
        onCollectionSuccess={async () => {
          dispatch.app.getCollections({})
        }}
        sendParams={{
          contractAddress: selectedToken.contractAddress,
          amount:  formValueRef.current?.amount ?? '',
          to: formValueRef.current?.toAddress ?? '',
          from: selectWallet.address,
          token_id: sendType === 'nft' ? currentNFT?.token_id : undefined,
          inscription_id:
            sendType === 'nft' ? currentInscription?.id : undefined,
        }}
      />
    )
  }

  return (
    <>
      <div className="app-body pb-5">
        <Back back={() => navigate(-1)} />
        {sendType === 'token' ? (
          <h1 className="font-bold text-2xl mt-10 mb-4 text-white">
            Send {selectedToken?.symbol}
          </h1>
        ) : (
          <>
            {selectNetwork.network === 'bitcoin' ? (
              <>
                <h1 className="font-bold text-2xl mt-10 mb-4 text-white">
                  Send inscription
                </h1>
                <div className="flex justify-center mb-4">
                  <div className="bg-3a3a rounded-xl pt-3 overflow-hidden">
                    <InscriptionView
                      className="mx-auto mb-2"
                      inscription={currentInscription!}
                    />
                    <p className="bg-5d5d px-2 text-primary">
                      #{currentInscription?.number}
                    </p>
                  </div>
                </div>

                {/* <p className="mb-2">OutputValue</p>
                <div className="flex gap-3 justify-center mb-8">
                  <div
                    className={`flex items-center w-24 h-12 justify-center rounded-xl ${
                      customInscriptionSats
                        ? 'text-white border border-5d5d'
                        : 'text-1515  bg-primary border border-primary'
                    }`}
                    onClick={() => {
                      form.setFieldValue('amount', '0.0001')
                      setCustomInscriptionSats(false)
                    }}
                  >
                    <div>
                      <p>Current</p>
                      <p>10000 sats</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center w-24 h-12 justify-center rounded-xl ${
                      !customInscriptionSats
                        ? 'text-white border border-5d5d'
                        : 'text-1515  bg-primary border border-primary'
                    }`}
                    onClick={() => setCustomInscriptionSats(true)}
                  >
                    Custom
                  </div>
                </div> */}
              </>
            ) : (
              <>
                <h1 className="font-bold text-2xl mt-10 mb-4 text-white">
                  Send NFT
                </h1>
                <div
                  className="p-1 rounded-xl flex items-center mb-16"
                  style={{ backgroundColor: '#4a4a4f' }}
                >
                  <img
                    className="w-14 h-14 rounded-md mr-2"
                    src={currentNFT?.imageUrl}
                    alt=""
                  />
                  <div>
                    <p className="text-white text-lg">{currentNFT?.name}</p>
                    <p className="text-white text-md">
                      #{currentNFT?.token_id}
                    </p>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <Form
          style={{
            '--border-top': '0',
            '--border-bottom': '0',
            '--border-inner': '0',
          }}
          form={form}
          onFinish={handleSubmit}
          initialValues={
            collectionId
              ? {
                  amount:
                    selectNetwork.network === 'bitcoin' ? '0.0001' : undefined,
                }
              : {
                  token: selectedToken?.symbol,
                }
          }
        >
          <Form.Item
            name="toAddress"
            // extra={<IconFont name="address" size={22} />}
            rules={[
              {
                required: true,
                message: (() => {
                  let message = ''
                  if (selectNetwork.network === 'IC') {
                    if (addressFormat.accountId && addressFormat.principal) {
                      message =
                        'Please enter Account ID / Principal ID (Wallet address)'
                      return message
                    }
                    if (addressFormat.principal) {
                      message = 'Please enter Principal ID(Wallet address)'
                      return message
                    }
                    if (addressFormat.accountId) {
                      message = 'Please enter Account ID(Wallet address)'
                      return message
                    }
                  } else {
                    message = 'address(0x) required.'
                  }
                  return message
                })(),
              },
              { validator: checkAddress },
            ]}
          >
            <TextArea
              placeholder={(() => {
                let message = ''
                if (selectNetwork.network === 'IC') {
                  if (addressFormat.accountId && addressFormat.principal) {
                    message = 'Account ID / Principal ID (Wallet address)'
                    return message
                  }
                  if (addressFormat.principal) {
                    message = 'ICP Wallet Principal ID'
                    return message
                  }
                  if (addressFormat.accountId) {
                    message = 'Account ID(Wallet address)'
                    return message
                  }
                } else if (selectNetwork.network === 'bitcoin') {
                  message = 'Enter address'
                } else {
                  message = 'Enter address(0x)'
                }
                return message
              })()}
              style={{ '--font-size': '14px' }}
              onChange={() => {
                setTimeout(() => {
                  checkForm()
                }, 50)
              }}
            />
          </Form.Item>
          {sendType === 'token' ||
          (selectNetwork.network === 'bitcoin' && customInscriptionSats) ? (
            <>
              <Form.Item
                name="amount"
                rules={[
                  {
                    required: true,
                    message: 'Please enter Amount',
                  },
                  {
                    validator: (_, value) => {
                      if (
                        !(
                          floatNumberRegex.test(value) ||
                          numberRegex.test(value)
                        ) ||
                        /^00+\.\d+$/.test(value)
                      ) {
                        return Promise.reject('Amount format is incorrect')
                      } else if (
                        Number(value) === 0 ||
                        balanceFromString(
                          value.toString(),
                          selectedToken.digits
                        ) +
                          BigInt(selectedToken.serviceCharge) >
                          BigInt(selectedToken.balance)
                      ) {
                        return Promise.reject('Insufficient amount')
                        // return Promise.resolve()
                      } else {
                        return Promise.resolve()
                      }
                    },
                  },
                ]}
              >
                <div className="flex">
                  <Input
                    className="custom-input"
                    style={{ textAlign: 'left', '--font-size': '40px' }}
                    placeholder={'0'}
                    clearable
                    onChange={() => {
                      setTimeout(() => {
                        checkForm()
                      }, 50)
                    }}
                  />
                  <a className="flex flex-row items-center pr-4 cursor-pointer">
                    <span className="text-white font-bold">
                      {selectedToken?.symbol}
                    </span>
                  </a>
                </div>
              </Form.Item>
            </>
          ) : null}
          <p className="mt-3 text-xs">Available: </p>
          <div className="text-white font-bold text-lg">
            {currentToken.balanceToString} {currentToken?.symbol}
          </div>
          {selectNetwork.network === 'IC' &&
          Number(currentToken.serviceCharge) !== 0 ? (
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
          {selectNetwork.network === 'bitcoin' ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-xl text-white">Fee</span>
                <div className="flex items-center">
                  <span className="text-base text-body">
                    {feeOptions[selectFeeIndex]?.name}
                    {feeOptions[selectFeeIndex]?.speed}
                  </span>
                  <div
                    className="border ml-2 border-5d5d rounded-lg w-8 h-8 flex justify-center items-center"
                    onClick={() => setFeeVisabled(!feeVisabled)}
                  >
                    <DownOutline
                      className={`text-6e707a ${feeVisabled ? '' : ''} text-lg`}
                    />
                  </div>
                </div>
              </div>
              {feeVisabled ? (
                <div className="flex gap-2 mt-2">
                  {feeOptions.map((option, index) => (
                    <div
                      key={option.name}
                      className={`rounded-2xl flex-1 h-16 flex flex-col justify-between p-2 bg-5d5d border-2 ${
                        feeOptions[selectFeeIndex]?.name === option.name
                          ? 'border-primary'
                          : 'border-5d5d'
                      } `}
                      onClick={() => {
                        dispatch.setting.save({ selectFeeIndex: index })
                      }}
                    >
                      <div>
                        <p className="font-bold text-white text-sm">
                          {option.name}
                        </p>
                        <p className="text-xs text-body">{option.feeDesc}</p>
                      </div>
                      <p className="text-white font-bold text-right whitespace-nowrap text-xss">
                        {option.speed}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
        </Form>
      </div>

      <div className="app-bottom">
        <div className="flex justify-end">
          <Button
            className="w-20 h-20 flex justify-center items-center"
            disabled={disableSend}
            color={disableSend ? 'default' : 'primary'}
            onClick={() => {
              form.submit()
            }}
          >
            <IconFont
              name="fanhui"
              color={'#fff'}
              style={{ transform: 'rotate(180deg)' }}
              size={36}
            />
          </Button>
        </div>
      </div>

      <Mask onMaskClick={() => setVisible(false)} visible={visible}>
        <div
          style={{
            width: '90%',
            maxWidth: 380,
            maxHeight: '70vh',
            overflow: 'auto',
            top: '40%',
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 10,
            padding: 0,
          }}
        >
          <List>
            {userTokens?.map((token) => {
              return (
                <List.Item
                  onClick={() => handleSelectToken(token)}
                  key={token.name}
                  prefix={<img className="h-7" src={token.icon} alt="" />}
                  description={token.name}
                  extra={
                    <div>
                      <p>{token.balance_usd}</p>
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
                  {token?.symbol}
                </List.Item>
              )
            })}
          </List>
        </div>
      </Mask>
    </>
  )
}

export default SendPage
