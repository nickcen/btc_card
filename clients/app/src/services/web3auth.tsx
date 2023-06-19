import { ADAPTER_EVENTS, CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { createContext, FunctionComponent, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "srcPath/store";
import { CHAIN_CONFIG, CHAIN_CONFIG_TYPE } from "../config/chainConfig";
import { getWalletProvider, IWalletProvider } from "./walletProvider";
import {
  Secp256k1KeyIdentity,
  Secp256k1PublicKey,
} from '@dfinity/identity-secp256k1';
import { fromHexString } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { createClient, configureChains, InjectedConnector, Client, getProvider, connect } from "@wagmi/core";

import { ClientID, GoogleClientID } from "srcPath/config/constants";
import { initWagmiClient } from "srcPath/utils";


export interface IWeb3AuthContext {
  web3Auth: Web3Auth | null;
  provider: SafeEventEmitterProvider | null;
  walletProvider: IWalletProvider | null;
  isLoading: boolean;
  user: unknown;
  chain: string;
  wagmiClient: Client | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  signMessage: () => Promise<any>;
  getAccounts: () => Promise<any>;
  getBalance: () => Promise<any>;
  signTransaction: () => Promise<void>;
  signAndSendTransaction: () => Promise<void>;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
  web3Auth: null,
  provider: null,
  wagmiClient: null,
  walletProvider: null,
  isLoading: false,
  user: null,
  chain: "",
  login: async () => {},
  logout: async () => {},
  getUserInfo: async () => {},
  signMessage: async () => {},
  getAccounts: async () => {},
  getBalance: async () => {},
  signTransaction: async () => {},
  signAndSendTransaction: async () => {},
});

export function useWeb3Auth(): IWeb3AuthContext {
  return useContext(Web3AuthContext);
}

interface IWeb3AuthState {
  chain: CHAIN_CONFIG_TYPE;
  children?: React.ReactNode;
}
interface IWeb3AuthProps {
  children?: ReactNode;
  chain: string;
}

export const Web3AuthProvider: FunctionComponent<IWeb3AuthState> = ({ children, chain }: IWeb3AuthProps) => {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<(SafeEventEmitterProvider) | null>(null);
  const [walletProvider, setWalletProvider] = useState<(IWalletProvider) | null>(null);
  const [wagmiClient, setWagmiClient] = useState<Client | null>(null)
  const [user, setUser] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<RootDispatch>()

  const setWalletProviderCallback = useCallback(
    (web3authProvider: SafeEventEmitterProvider) => {
      const walletProvider = getWalletProvider(chain, web3authProvider, uiConsole);
      onSuccess(web3authProvider)
      setWalletProvider(walletProvider);
    },
    [chain]
  );

  useEffect(() => {
    const subscribeAuthEvents = (web3auth: Web3Auth) => {
      // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
      web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: unknown) => {
        console.log("Yeah!, you are successfully logged in", data);
        setUser(data);
        setWalletProviderCallback(web3auth.provider!);
      });

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log("connecting");
      });

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("disconnected");
        setUser(null);
      });

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.error("some error or user has cancelled login request", error);
      });
    };
    async function init() {
      try {
        setIsLoading(true);
        if(process.env.LOGIN_TYPE === 'ic'){
          return setIsLoading(false);
        }
        const  { chains, client } = initWagmiClient();
    
        //@ts-ignore
        setWagmiClient(client)
        const clientId =
        ClientID;

        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x" + chains[0].id.toString(16),
          },
          // web3AuthNetwork: "cyan",
          web3AuthNetwork: "mainnet",
          // web3AuthNetwork: "testnet",
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            loginConfig: {
              google: {
                verifier: "Astro Card-web-google",
                typeOfLogin: "google",
                clientId:
                GoogleClientID, //use your app client id you got from google
              },
            },
          },
        });
        web3auth.configureAdapter(openloginAdapter);
        setWeb3Auth(web3auth);

        await web3auth.init();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
          setWalletProviderCallback(web3auth.provider!);
          console.log("web3auth initialized yet");
        } else {
          console.log("web3auth not initialized yet");
          dispatch.app.save({initProccess: false});
          (window.parent ?? window.opener)?.postMessage({
            kind: 'auth-failed',
            data: null
          }, '*');
        }
      } catch (error) {
        console.error(error);
      } finally {
        console.log('web3auth initialized finally')
        setIsLoading(false);
      }
    }
    init();
  }, [chain, setWalletProvider]);

  const login = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      uiConsole("web3auth not initialized yet");
      return;
    }
    // const localProvider = await web3Auth.connect();
    const localProvider = await web3Auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "google",
      }
    );
    console.log('localProvider', localProvider)
    if(localProvider) {
      setProvider(localProvider);
      setWalletProviderCallback(localProvider);
    }
  };

  const onSuccess = async (provider: SafeEventEmitterProvider) => {
    setProvider(provider);
    const privateKey = (await provider!.request({
      method: 'private_key',
    })) as string;
    // const publicKey = (await provider!.request({
    //   method: 'public_key',
    // })) as string;
    // console.log('publicKey',publicKey)
    const delegationIdentity = Secp256k1KeyIdentity.fromSecretKey(
      fromHexString(privateKey as string),
    );
    console.log('delegationIdentity',delegationIdentity, delegationIdentity.getPublicKey())
    dispatch.app.save({
      provider: provider,
      privateKey,
      delegationIdentity
    })
    dispatch.app.initCtrl({
      delegationIdentity
    })
  }

  const logout = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3Auth.logout();
    setProvider(null);
  };

  const getUserInfo = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3Auth.getUserInfo();
    uiConsole(user);
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      uiConsole("provider not initialized yet");
      return;
    }
    return  await walletProvider?.getAccounts();
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      uiConsole("provider not initialized yet");
      return;
    }
    await walletProvider?.getBalance();
  };

  const signMessage = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      uiConsole("provider not initialized yet");
      return;
    }
    await walletProvider?.signMessage();
  };

  const signTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      uiConsole("provider not initialized yet");
      return;
    }
    await walletProvider?.signTransaction();
  };

  const signAndSendTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      uiConsole("provider not initialized yet");
      return;
    }
    await walletProvider?.signAndSendTransaction();
  };

  // const getPrivteKey = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   await provider.request({
  //     method: 'private_key',
  //   });
  // };

  const uiConsole = (...args: unknown[]): void => {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  };

  const contextProvider = {
    web3Auth,
    chain,
    provider,
    walletProvider,
    user,
    isLoading,
    login,
    logout,
    getUserInfo,
    getAccounts,
    getBalance,
    signMessage,
    signTransaction,
    signAndSendTransaction,
    uiConsole,
    wagmiClient,
    // getPrivteKey,
  };
  return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
};
