"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  account: string | null;
  connectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);

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
      setAccount(accounts[0].toLowerCase());

      ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0].toLowerCase());
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
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  return (
    <AuthContext.Provider value={{ account, connectWallet }}>
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
