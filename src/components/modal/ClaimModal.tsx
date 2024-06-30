"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BrowserProvider, Contract } from "ethers";
import { ABI } from "@/abis/agent";

import DatePicker from "react-date-picker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import 'react-calendar/dist/Calendar.css'; 

import "./claimModal.css";
import { formatDate } from "@/utils/date";
import { useWeatherData } from "@/context/WeatherProvider";
import { createClaim } from "@/actions/claims";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useModalContext } from "@/context/ModalProvider";
import { Loading } from "../ui/Loading";
import { CLAIM_PROMPT } from "@/lib/web3/prompts";

interface Message {
  role: string;
  content: string;
}

type ValuePiece = Date | null;

const ClaimModal = () => {
  const [claims, setClaims] = useState({
    cropDamage: false,
    fire: false,
    flooding: false,
    other:false,
  });
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const { lastDay, weatherData } = useWeatherData();
  const [value, onChange] = useState<ValuePiece>(lastDay);

  const router = useRouter();

  const {account} = useAuth();

  
  const {closeModal} = useModalContext();

  const getWeatherOnDate = (date: ValuePiece) => {
    if (!date) return null;
    const idx = weatherData.labels.indexOf(formatDate(date));
    const data = weatherData.datasets.reduce((acc, curr) => {
      acc.push({
        label: curr.label,
        data: curr.data[idx],
      });
      return acc;
    }, []);

    return data;
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setClaims((prevClaims) => ({
      ...prevClaims,
      [name]: checked,
    }));
  };

  const sendWeb3Claim = async () => {
    try {
      const {ethereum} = window as any;
      const ethersProvider = new BrowserProvider(ethereum);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
        ABI,
        signer
      );
      const prompt = CLAIM_PROMPT({
        weatherData: getWeatherOnDate(value),
        location: weatherData.city,
        claimDate: value || new Date(),
        claim: {
          type: Object.entries(claims).find(([key, value]) => value === true)?.[0] || "other",
          explanation
        }
      })

      const transactionResponse = await contract.claim(prompt);
      return transactionResponse.hash;
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      sendWeb3Claim().then(async (tx) => {
        if (!tx) return;
        const claimResp = await toast.promise(createClaim({
          claims,
          explanation,
          account,
          tx
        }), {
          loading: "Saving...",
          success: <b>Claimed send!</b>,
          error: <b>Could not send.</b>
        });
        closeModal();
        router.push(`/claims?id=${claimResp.claimId}&account=${account}`);
      }).catch((e) => {
        console.log("e", e);
        toast.error("Error sending tx");
      })
      closeModal();
        
    } catch (error) {
      console.log("error", error);
      toast.error("Error sending claim");
      setLoading(false)
    } 
  };

  return (
    <div className="claim-form">
      <h1 className="text-large font-bold">Insurance Claim Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <div>
            <input
              className="mr-3"
              type="checkbox"
              name="cropDamage"
              checked={claims.cropDamage}
              onChange={handleCheckboxChange}
            />
            <label>Crop Damage</label>
          </div>
          <div>
            <input
              className="mr-3"
              type="checkbox"
              name="fire"
              checked={claims.fire}
              onChange={handleCheckboxChange}
            />
            <label>Fire</label>
          </div>
          <div>
            <input
              className="mr-3"
              type="checkbox"
              name="flooding"
              checked={claims.flooding}
              onChange={handleCheckboxChange}
            />
            <label>Flooding</label>
          </div>
          <div>
            <input
              className="mr-3"
              type="checkbox"
              name="other"
              checked={claims.other}
              onChange={handleCheckboxChange}
            />
            <label>Other</label>
          </div>
          {claims.other && <input
              className="mr-3"
              type="text"
              name="reason"
              onChange={handleCheckboxChange}
            />}
        </div>
        <div className="mb-3">
          <label className="text-large font-bold">Date of event:</label>
          <p className="text-gray-500 text-sm">⚠️ Latest API data might not be available yet</p>
          <p className="text-gray-500 text-sm">In order to submit a claim, you must have paid a premium on that day</p>
          <p className="text-gray-500 text-sm">⚠️ (However if current payment day isn't there, clear the calendar)</p>
          <DatePicker
            className="text-black"
            onChange={onChange}
            value={value}
            endDate={lastDay}
            maxDate={lastDay}
            isClearable={true}
          />
        </div>

        <div className="mb-3">
          <label>Explanation:</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>{loading ? <Loading /> : "Submit claim"}</button>
      </form>
    </div>
  );
};

export default ClaimModal;
