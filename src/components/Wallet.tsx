"use client";

import { useCallback, useEffect, useState } from "react";

export interface AccountType {
  address?: string;
  balance?: string;
  chainId?: string;
  network?: string;
}

const GALADRIEL_CHAIN_ID = "0xaa289";
const SEPOLIA_CHAIN_ID = "0xaa36a7";

export default function Wallet() {
  const [account, setAccount] = useState<AccountType>();

  const handleChainChanged = (_chainId: string) => {
    window.location.reload();
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      console.log("ethereum", ethereum);
      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const chainId: string = await ethereum.request({ method: "eth_chainId" });
      setAccount({ address: accounts[0].toLowerCase(), chainId: chainId });
      ethereum.on("chainChanged", handleChainChanged);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      console.log("ethereum", ethereum);
      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const chainId: string = await ethereum.request({ method: "eth_chainId" });

      if (chainId != GALADRIEL_CHAIN_ID) {
        await switchNetwork();
      }
      setAccount({ address: accounts[0].toLowerCase(), chainId: chainId });

      ethereum.on("chainChanged", handleChainChanged);
    } catch (error) {
      console.log(error);
    }
  };

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
      } catch (error: any) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "11155111",
                  chainName: "Sepolia Test Network",
                  rpcUrls: ["https://eth-sepolia-public.unifra.io"],
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "SepoliaETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert(
        "MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html"
      );
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  console.log(account);

  function getButtonText() {
    if (account?.address) {
      return account?.address;
    }
    return "Connect to MetaMask";
  }

  return (
    <button
      onClick={() => connectWallet()}
      className="bg-black text-white p-4 rounded-lg"
    >
      {getButtonText()}
    </button>
  );
}
