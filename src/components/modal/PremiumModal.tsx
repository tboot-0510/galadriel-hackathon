"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BrowserProvider, Contract, ethers, TransactionReceipt } from "ethers";
import { ABI } from "@/abis/agent";

import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { convertToISODate, formatDate, formatDateTime } from "@/utils/date";
import { useWeatherData } from "@/context/WeatherProvider";
import { getAgentRunId, getNewMessages } from "@/lib/web3/agent";
import { createClaim } from "@/actions/claims";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useModalContext } from "@/context/ModalProvider";


import "./claimModal.css";

interface Message {
  role: string;
  content: string;
}

type ValuePiece = Date | null;

const PremiumModal = () => {
  const [claims, setClaims] = useState({
    cropDamage: false,
    fire: false,
    flooding: false,
    disease: false,
  });
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const { lastDay, weatherData } = useWeatherData();
  const [value, onChange] = useState<ValuePiece>(convertToISODate(lastDay));

  
  const router = useRouter();

  const {account} = useAuth();
  const {closeModal} = useModalContext();

  const getWeatherOnDate = (date: ValuePiece) => {
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
      const ethersProvider = new BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
        ABI,
        signer
      );

      const transactionResponse = await contract.runAgent(
        `Based on provided weather data: ${JSON.stringify(
          getWeatherOnDate(value)
        )}, determine if there is a chance that fire occured due to natural circonstances (excluding artificial fire) around Paris on ${value}. Conclude by saying : Possible/Impossible/Need verification`,
        10
      );
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
        const tx = await sendWeb3Claim();
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
    } catch (error) {
      console.log("error", error);
      toast.error("Error sending claim");
      setLoading(false)
    } 
  };

  return (
    <div className="claim-form">
      <h1>Premium Payment Overview</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="mb-3">Claims:</label>
          <div>
            <input
              type="checkbox"
              name="cropDamage"
              checked={claims.cropDamage}
              onChange={handleCheckboxChange}
            />
            <label>Crop Damage</label>
          </div>
          <div>
            <input
              type="checkbox"
              name="fire"
              checked={claims.fire}
              onChange={handleCheckboxChange}
            />
            <label>Fire</label>
          </div>
          <div>
            <input
              type="checkbox"
              name="flooding"
              checked={claims.flooding}
              onChange={handleCheckboxChange}
            />
            <label>Flooding</label>
          </div>
          <div>
            <input
              type="checkbox"
              name="disease"
              checked={claims.disease}
              onChange={handleCheckboxChange}
            />
            <label>Disease</label>
          </div>
        </div>
        <div className="mb-3">
          <label>Date of event:</label>
          <p>Warning! Latest API data might not be available yet</p>
          <DatePicker
            onChange={onChange}
            value={value}
            endDate={formatDateTime(new Date(), true)}
            maxDate={new Date()}
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
        <button type="submit">Submit Claim</button>
      </form>
    </div>
  );
};

export default PremiumModal;
