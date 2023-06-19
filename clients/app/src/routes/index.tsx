import SendPage from '../pages/Send';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from "react-router-dom"
// import App from '../App';
import Layout from '../layout';
import AssetsPage from '../pages/Assets';
import ActivePage from 'srcPath/pages/Active';
import IndexPage from 'srcPath/pages';
import ErrorPage from 'srcPath/pages/Error';
import Transaction from 'srcPath/pages/auth/Transaction';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />}></Route>
          {/* <Route index element={<App />}></Route> */}
          <Route path="/assets" element={<AssetsPage />}></Route>
          <Route path="/send" element={<SendPage />}></Route>
          <Route path="/active" element={<ActivePage />}></Route>
          <Route path="/transaction" element={<Transaction />}></Route>
          <Route path="/error" element={<ErrorPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}