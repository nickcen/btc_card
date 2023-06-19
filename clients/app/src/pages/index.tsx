import { Button, Modal } from 'antd-mobile'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import IconFont from 'srcPath/components/iconfont'
import { useWeb3Auth } from 'srcPath/services/web3auth'
import { CARD, CARD1, CARD1BG, LOADING, LOGO } from 'srcPath/utils/resource'
import nftJson from 'srcPath/assets/lottie/card.json'
import Lottie from 'lottie-react';
import { DownFill } from 'antd-mobile-icons'
import { useSelector } from 'react-redux'
import { RootState } from 'srcPath/store'
import { useConnect } from '@connect2ic/react'
import Footer from 'srcPath/components/Footer'
import { AuthClient } from 'srcPath/services/auth'
import { useM3Auth } from 'srcPath/services/m3Provider'

const IndexPage = () => {
  const { login, provider, walletProvider, web3Auth, isLoading, wagmiClient } =
    useWeb3Auth()
  const { login: m3Login, isConnected: m3IsConnected, logout: m3Disconnect, identity } = useM3Auth()

  const navigate = useNavigate()
  const { initProccess } = useSelector((state: RootState) => state.app)
  const { connect, isConnected, disconnect } = useConnect()
  const clientRef = useRef<AuthClient>()

  const handleIIConnect = async () => {
    console.log('connect')
    const result = connect((window as any).icx ? 'icx' : 'ii');
    console.log('result', result)
  }

  const handleM3Connect = async () => { 
    console.log('login')
    await m3Login()
    console.log('client', clientRef.current)
  }

  // useEffect(() => {
  //   const dom = document.querySelector('.app-container');
  //   dom?.classList.add('index-bg')
  //   return () => {

  //     dom?.classList.remove('index-bg')
  //   }
  // }, [])

  if (isLoading || initProccess) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <img
          src={LOADING}
          className="w-20 h-20 animate-spin duration-1000"
          alt=""
        />
      </div>
    )
  }

  return (
    <>
      <div className="app-body overflow-hidden -m-5 pt-5">
        <div className="flex flex-col justify-center items-center relative overflow-hidden" style={{
          height: 'calc(var(--vh, 1vh) * 100 - 100px)',
        }}>
         <h1 className='text-white text-xl'>BTC lite wallet</h1>
        </div>
      </div>
      <div className="app-bottom">
        <Button
          color="primary"
          onClick={async () => {
            if(isConnected) {
              await disconnect()
            }
            if(process.env.LOGIN_TYPE === 'ic') {
              handleIIConnect()
            } else if(process.env.LOGIN_TYPE === 'm3') {
              handleM3Connect()
            } else {
              login()
            }
          }}
          className='bg-white'
         
        >
          <div className="flex justify-center items-center">
            {/* <img src={LOGO} className='h-4 mr-2' alt="" /> */}
            Login with Email
          </div>
        </Button>
      </div>
    </>
  )
}

export default IndexPage
