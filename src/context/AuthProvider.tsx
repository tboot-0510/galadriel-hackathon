"use client";

import { getUser } from "@/actions/user";
import { redirect } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  account: string | null;
  user: User | null;
  connectWallet: () => void;
  meApi: (address:string) => void;
}

interface User {
  id: number;
  role: string;
  address: string;
  knowledgeCID?: string;
  landCoordinates?: any;
  insuredValue?: number;
  estimatedPremium?: number;
  premiums?: any;
  claims?: any;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); 

  const meApi = async (address: string) => {
    try {
      const response = await fetch(`/api/user?account=${address}`);
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0].toLowerCase();
      setAccount(account);
      await meApi(account);

      ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(account);
        meApi(account);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window as any;
        if (!ethereum) {
          alert("Get MetaMask -> https://metamask.io/");
          return;
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0].toLowerCase());
          await meApi(accounts[0].toLowerCase());
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  return (
    <AuthContext.Provider value={{ account, user, connectWallet, meApi }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
