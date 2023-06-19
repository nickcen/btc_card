import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import './assets/css/style.css'
import './App.css'
import './reset.less'
import './index.less'
import enUS from 'antd-mobile/es/locales/en-US'
import { Router } from './routes'
import { store } from './store'
import { createClient } from '@connect2ic/core'
import { Connect2ICProvider } from '@connect2ic/react'
import {
  InternetIdentity,
} from "@connect2ic/core/providers"
import { ConfigProvider } from 'antd-mobile'
import { M3AuthProvider } from './services/m3Provider'
import { AuthClient } from './services/auth'

function appHeight() {
  const doc = document.documentElement
  doc.style.setProperty('--vh', window.innerHeight * 0.01 + 'px')
}

appHeight()
window.addEventListener('resize', () => {
  appHeight()
})

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

const client = createClient({
  providers: [
    new InternetIdentity(),
  ],
  globalProviderConfig: {
    whitelist: ['qhbym-qaaaa-aaaaa-aaafq-cai'],
  },
})
// const chains = networksConfig.filter(o => o.id !== 0);
const m3Client = AuthClient.create({
  providerUrl: 'https://uh6dy-laaaa-aaaai-acqqa-cai.icp0.io',
  // providerUrl: 'http://localhost:5173',
})
root.render(
  <StrictMode>
    <Connect2ICProvider client={client}>
      <M3AuthProvider client={m3Client}>
        <Provider store={store}>
          {/* <Web3AuthProvider chain={defaultNetwork.network}> */}
            <ConfigProvider locale={enUS}>
              <Router />
            </ConfigProvider>
          {/* </Web3AuthProvider> */}
        </Provider>
      </M3AuthProvider>
    </Connect2ICProvider>
  </StrictMode>
)
