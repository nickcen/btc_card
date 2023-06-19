

import { SignIdentity } from "@dfinity/agent";
import { FunctionComponent, ReactNode, createContext, useContext, useEffect, useState  } from "react";
import { AuthClient } from "./auth";


export interface UseM3Auth {
  // wallet: string;
  identity: SignIdentity | undefined;
  client: AuthClient | undefined;
  email: string | undefined;
  isConnected: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const M3AuthContext = createContext<UseM3Auth>({
  // wallet: "",
  identity: undefined,
  client: undefined,
  email: undefined,
  isConnected: false,
  login: async () => {},
  logout: async () => {},
});

interface M3AuthProps {
  children?: ReactNode;
  client: AuthClient;
}

export function useM3Auth(): UseM3Auth {
  return useContext(M3AuthContext);
}

export const M3AuthProvider: FunctionComponent<M3AuthProps> = ({ children, client }) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [wallet, setWallet] = useState("");
  const [identity, setIdentity] = useState<SignIdentity | undefined>(client.identity);
  const [curClient, setClient]  = useState<AuthClient | undefined>(client);
  const [isConnected, setIsConnected] = useState(client.isAuthenticated);
  const [email, setEmail] = useState(client.userName)

  useEffect(() => {
    async function init() {
      try {
        
      } catch (error) {
        console.error(error);
      } finally {
        console.log('m3auth initialized finally')
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const login = async () => {
    if (!client) {
      console.log("web3auth not initialized yet");
      return;
    }
    const result = await client.login();
    console.log('m3 connected login result', client, client.identity, client.isAuthenticated)
    setClient(client);
    setIdentity(client.identity);
    setIsConnected(client.isAuthenticated);
    setEmail(client.userName!)
    console.log('userName=====', client.userName)
  };

  const logout = async () => {
    if (!client) {
      console.log("web3auth not initialized yet");
      return;
    }
    await client.logout();
    setClient(client);
    setIdentity(client.identity);
    setIsConnected(client.isAuthenticated);
    setEmail(client.userName!)
  };

  const contextProvider = {
    // wallet,
    isConnected,
    identity,
    client: curClient,
    email,
    login,
    logout,
  };
  return (
    <M3AuthContext.Provider value={contextProvider}>{children}</M3AuthContext.Provider>
  );
};
