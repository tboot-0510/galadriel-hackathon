"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BrowserProvider, Contract, ethers } from "ethers";
import { ABI } from "@/abis/agent";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "@/context/AuthProvider";
import { useModalContext } from "@/context/ModalProvider";

import "./claimModal.css";
import { createPremiumPayment } from "@/actions/user";
import { Loading } from "../ui/Loading";
import { formatDate, getUnixTimestamp } from "@/utils/date";

const PremiumModal = ({value}:{value:number}) => {
  const [loading, setLoading] = useState(false);

  const {user} = useAuth();
  const {closeModal} = useModalContext();

  const computedValue = (value:number) => {
    const v = value * 0.001;
    return ethers.parseEther(v.toString());
  }

  const sendWeb3Tx = async () => {
    try {
      const {ethereum} = window as any;
      const ethersProvider = new BrowserProvider(ethereum);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
        ABI,
        signer
      );

      const transactionResponse = await contract.depositPremium({value: computedValue(value)});
      return transactionResponse.hash;
      
    } catch (error: any) {
      const errType = error.shortMessage === 'execution reverted (unknown custom error)'
      if (errType) {
        toast.error("Premium already deposited for today");
        return;
      }
      toast.error(error);
    }
  };

  const handlePremiumPayment = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
        sendWeb3Tx().then(async (tx) => {
          if (!tx) return;
          await toast.promise(createPremiumPayment({
            userId: user?.id,
            value: value,
            tx,
            date: getUnixTimestamp(new Date())
          }), {
            loading: "Saving...",
            success: <b>Payment saved!</b>,
            error: <b>Could not save.</b>
          });
        }).catch((e) => {
          console.log("e", e);
          toast.error("Error sending tx");
        })
        closeModal();
    } catch (error) {
      console.log("error", error);
      toast.error("Error saving payment");
      setLoading(false)
    } 
  };

  return (
    <div className="claim-form">
      <form onSubmit={handlePremiumPayment}>
        <p className="text-gray-500 text-sm mb-3">⚠️ For the demo, we set the arbitrary value of $100 equals 0.1GAL</p>
        <div className="mb-3">
          <label className="text-large font-bold mb-1">Overview of transaction</label>
          <p className="text-gray-500 text-sm mb-3">{`Insurance premium for ${formatDate(new Date())}`}</p>
          <div className="flex flex-col justify-center items-center">
            <p className="text-2xl font-bold">${value}</p>
            <p className="text-gray-500 text-sm mb-3">{`~ ${value * 0.001}GAL`}</p>
          </div>
        </div>
        <button type="submit" disabled={loading}>{loading ? <Loading /> : "Pay premium"}</button>
      </form>
    </div>
  );
};

export default PremiumModal;
