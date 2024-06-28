"use client";
import { useAuth } from "@/context/AuthProvider";
import Button from "./ui/Button";
import { truncateWalletAddress } from "@/utils/string";
import { useModalContext } from "@/context/ModalProvider";
import ClaimModal from "./modal/ClaimModal";

import { usePathname } from 'next/navigation'
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { BrowserProvider, JsonRpcProvider, ethers } from "ethers";


export default function Header({ params, searchParams }: any) {
  const { account } = useAuth();
  const { openModal } = useModalContext();
  const path = usePathname();
  const [balance,setBalance] = useState(0);

  const openClaimModal = () => {
    openModal({
      title: "Scan a website",
      contentElement: <ClaimModal />,
    });
  };

  const getAccountBalance = async () => {
    try {
      const { ethereum } = window as any;
      const ethersProvider = new BrowserProvider(ethereum);
      const balance = await ethersProvider.getBalance(account);
      setBalance(Number(ethers.formatEther(balance)));
      
    } catch (e) {
      console.log(e);
      toast.error("Error getting account balance");
      
    }
  }

  useEffect(() => {
    if (!account) return;
    getAccountBalance();
  }, [account]);

  if (!account || path === "/") return <></>

 
  return (
    <nav className="flex w-full items-center justify-between px-24 py-4">
      <div className="flex w-full gap-4 justify-center lg:w-auto  lg:rounded-xl">
        <p className="fixed min-w-[18rem] left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          {truncateWalletAddress({ numberDisplayed: 10, string: account })}
        </p>
        <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          {balance}{"GAL 💰"}
        </p>
      </div>
      <div className="flex w-full gap-2 sm:w-fit">
        <Button
          title="Make a claim"
          onClick={openClaimModal}
          additionalStyle={{
            marginBottom: "12px",
            backgroundColor: "white",
            color: "black",
          }}
        />
        <Button
          title="Launch AI Agent"
          onClick={() => console.log("click claimable")}
          additionalStyle={{
            marginBottom: "12px",
            backgroundColor: "blue",
            color: "white",
          }}
        />
      </div>
    </nav>
  );
}
