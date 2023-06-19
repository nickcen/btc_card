import { Button, Form, Input, Toast } from 'antd-mobile'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import Back from 'srcPath/components/Back'
import { RootDispatch, RootState } from 'srcPath/store'
import { delay } from 'srcPath/utils'
import { useCountDown } from 'ahooks'
import PinCode from 'srcPath/components/pincode'
import { DONE } from 'srcPath/utils/resource'
import { getEmailCode, sendActivateCode } from 'srcPath/utils/http/api/api'
import IconFont from 'srcPath/components/iconfont'
import { useWeb3Auth } from 'srcPath/services/web3auth'
import { emailRegex } from 'srcPath/utils/reg'
import { aaCid } from 'srcPath/services/ctrlConnection'
import { FormInstance } from 'antd-mobile/es/components/form'
import { useM3Auth } from 'srcPath/services/m3Provider'

const ActivePage = () => {
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const isEmail = query.get('email')
  console.log('isEmail', isEmail)
  console.log('query', query)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [viewType, setViewType] = useState<'activate' | 'success' | 'email'>(
    isEmail ? 'email' : 'activate'
  )
  const { selectWallet, ctrlConnection, userInfo, delegationIdentity } =
    useSelector((state: RootState) => state.app)
  const codeRef = useRef()
  const {
    email: m3Email,
  } = useM3Auth()
  const dispatch = useDispatch<RootDispatch>()
  const [sendCode, setSendCode] = useState(false)
  const [email, setEmail] = useState(process.env.LOGIN_TYPE === 'm3' ? m3Email: userInfo?.email || '')
  const [form] = Form.useForm<FormInstance>()
  const [targetDate, setTargetDate] = useState<number | undefined>();
  const [countdown, formattedRes] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined);
    },
  });

  const activate = async () => {
    if (codeRef.current && /\d/.test(codeRef.current!)) {
      setLoading(true)
      const result = await ctrlConnection?.activate({
        card_code: selectWallet.card_code,
        active_code: codeRef.current,
        // active_code: 'active_code_1',
        email: email,
      })
      if (result) {
        setLoading(false)
        localStorage.setItem('active', 'true')
        Toast.show('Activate successfully.')
        setViewType('success')
        // getEmailCode({
        //   type: 'ACTIVATE_ASTRO_CARD',
        //   email:  email,
        // })
      } else {
        setLoading(false)
        Toast.show('Activate failed.')
      }
    } else {
      Toast.show('Activate failed.')
    }
  }

  const emailValidate = async (_: any, value: string) => {
    if (emailRegex.test(value)) {
      setSendCode(true)
      return Promise.resolve(true)
    } else {
      setSendCode(false)
      return Promise.reject(new Error('Incorrect email.'))
    }
  }

  // const next = (values: { email: any }) => {
  //   sendActivateCode({
  //     canisterId: aaCid,
  //     cardCode: selectWallet.card_code,
  //     email: values?.email,
  //     providerUrl: 'https://icp2anv.card3.co',
  //   })
  //   setEmail(values.email)
  //   Toast.show('Activation code sent to your email')
  //   setViewType('activate')
  // }

  if (viewType === 'success') {
    return (
      <>
        <div className="app-body">
          <div
            className="flex flex-col justify-center items-center"
            style={{ height: 'calc(var(--vh, 1vh) * 100 - 120px)' }}
          >
            <div className="text-center">
              <img className="mx-auto" src={DONE} alt="" />
              <h2 className="text-xl text-white font-bold mt-2">
                Wallet Activated
              </h2>
            </div>
          </div>
        </div>
        <div className="app-bottom">
          <Button
            color="primary"
            type="submit"
            onClick={() => {
              dispatch.app.initCtrl({ delegationIdentity })
            }}
            className="w-full mt-10"
          >
            Start
          </Button>
        </div>
      </>
    )
  }

  // if (viewType === 'email') {
  //   return (
  //     <>
  //       <div className="app-body">
  //         <h2 className="text-2xl text-white font-bold">
  //           Enter email to receive activation code
  //         </h2>
  //         <Form
  //           className="mt-5"
  //           form={form}
  //           onFinish={next}
  //           style={{ '--border-top': '0px', '--border-bottom': '0px' }}
  //         >
  //           <Form.Item
  //             name="email"
  //             rules={[
  //               {
  //                 required: true,
  //                 message: 'Please enter email.',
  //               },
  //               {
  //                 validator: emailValidate,
  //                 validateTrigger: 'onChange',
  //               },
  //             ]}
  //           >
  //             <Input placeholder="Please enter email" />
  //           </Form.Item>
  //         </Form>
  //       </div>
  //       <div className="app-bottom">
  //         <Button
  //           color="primary"
  //           disabled={!sendCode}
  //           className="w-full mt-10"
  //           onClick={ async() => {
  //             form.submit();
  //           }}
  //         >
  //           Next
  //         </Button>
  //       </div>
  //     </>
  //   )
  // }

  return (
    <>
      <div className="app-body">
        {/* <Back back={() => navigate(-1)} />
        <div className="py-8 mb-10">
          <p className="text-xs text-gray-400">Your wallet address: </p>
          <h2 className="text-xl text-white font-family-Mono">
            {`${selectWallet.address?.slice(0, 5)}`}...
            {selectWallet.address?.slice(-4)}
          </h2>
        </div> */}
        {/* <div className="bg-primary px-2 py-5 flex mb-14 rounded-md1">
          <IconFont name="email" size={24} color="#fff" className="mr-2" />
          <div className="flex-1 text-white">
            <p>The activation code has been sent to your email: </p>
            <a className="underline font-bold">{email}</a>
            <div className='mt-1 flex justify-end'>
              <a className='text-white underline inline-block bg-1515 rounded-md1 px-4 py-2' onClick={() => {
                if(targetDate) return;
                sendActivateCode({
                  canisterId: aaCid,
                  cardCode: selectWallet.card_code,
                  email: email,
                  providerUrl: window.location.origin,
                })
                setTargetDate(new Date().getTime() + 60 * 1000);
                Toast.show('Activation code sent to your email')
              }}>
                <h6>{targetDate ? `Send again ${Math.ceil(countdown / 1000)} s` : 'Send again'}</h6>
                </a>
            </div>
          </div>
        </div> */}
        <h2 className="text-2xl text-white font-bold">Activation code:</h2>
        <Form
          className="mt-5"
          onFinish={activate}
          style={{ '--border-top': '0px', '--border-bottom': '0px' }}
        >
          <PinCode
            length={4}
            value={codeRef.current}
            pattern={/[^\d]/g}
            onChange={(value) => {
              codeRef.current = value
            }}
          />
        </Form>
      </div>
      <div className="app-bottom">
        <Button
          color="primary"
          type="submit"
          onClick={activate}
          loading={loading}
          className="w-full mt-10"
        >
          Activate
        </Button>
      </div>
    </>
  )
}

export default ActivePage
