"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BrowserProvider, Contract } from "ethers";
import { ABI } from "@/abis/agent";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "@/context/AuthProvider";
import { useModalContext } from "@/context/ModalProvider";

import "./claimModal.css";
import { Loading } from "../ui/Loading";
import { addInsuredValue } from "@/actions/user";

const InsureModal = () => {
  const [loading, setLoading] = useState(false);
  const [insuredValue, setInsuredValue] = useState(100000);

  const {account, meApi} = useAuth();
  const {closeModal} = useModalContext();

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

      const transactionResponse = await contract.storeInsuredAmount(insuredValue);
      return transactionResponse.hash;
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleSavingGoods = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
        await sendWeb3Tx();
        await toast.promise(addInsuredValue({
          value: insuredValue,
          account
        }), {
          loading: "Saving...",
          success: <b>Saved!</b>,
          error: <b>Could not save.</b>
        });
        meApi(account);
        closeModal();
    } catch (error) {
      console.log("error", error);
      toast.error("Error saving");
      setLoading(false)
    } 
  };

  const handleInputChange = (event:any) => {
    setInsuredValue(event.target.value);
  };


  return (
    <div className="claim-form">
      <form onSubmit={handleSavingGoods}>
        <h1 className="text-large font-bold mb-3">Insurance Form</h1>
        <p className="text-gray-500 text-sm mb-3">⚠️ For the demo, we set the arbitrary value of $100 equals 0.1GAL</p>
        <div className="mb-3">
          <label className="text-large font-bold">Value of insured goods:</label>
          <input
            id="insuredValue"
            name="insuredValue"
            type="number"
            min="10_000"
            value={insuredValue}
            onChange={handleInputChange}
            step="10000"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <p className="text-gray-500 text-sm mb-3">{`You evaluate your property at: $${insuredValue}`}</p>
        <button type="submit" disabled={loading}>{loading ? <Loading /> : "Submit insured goods"}</button>
      </form>
    </div>
  );
};

export default InsureModal;
