"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BrowserProvider, Contract, ethers, TransactionReceipt } from "ethers";
import { ABI } from "@/abis/agent";

import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

import "./claimModal.css";
import { convertToISODate, formatDate, formatDateTime } from "@/utils/date";
import { useWeatherData } from "@/context/WeatherProvider";
import { getAgentRunId, getNewMessages } from "@/lib/web3/agent";
import { createClaim } from "@/actions/claims/createClaim";
import { useAuth } from "@/context/AuthProvider";

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
    disease: false,
  });
  const [explanation, setExplanation] = useState("");
  const { lastDay, weatherData } = useWeatherData();
  const [value, onChange] = useState<ValuePiece>(convertToISODate(lastDay));

  const {account} = useAuth();

  const getWeatherOnDate = (date: ValuePiece) => {
    const idx = weatherData.labels.indexOf(formatDate(date));
    console.log("idx", idx);
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
      console.log("signer", signer);
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
      console.log("transactionResponse", transactionResponse);
      const receipt = await transactionResponse.wait();
      console.log(`Task sent, tx hash: ${receipt.hash}`);
      let agentRunID = getAgentRunId(receipt, contract);
      console.log(`Created agent run ID: ${agentRunID}`);
      //   if (!agentRunID && agentRunID !== 0) {
      //     return;
      //   }

      let allMessages: Message[] = [];
      // Run the chat loop: read messages and send messages
      var exitNextLoop = false;
      while (true) {
        const newMessages: Message[] = await getNewMessages(
          contract,
          agentRunID,
          allMessages.length
        );
        if (newMessages) {
          for (let message of newMessages) {
            let roleDisplay = message.role === "assistant" ? "THOUGHT" : "STEP";
            let color = message.role === "assistant" ? "\x1b[36m" : "\x1b[33m"; // Cyan for thought, yellow for step
            console.log(`${color}${roleDisplay}\x1b[0m: ${message.content}`);
            allMessages.push(message);
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (exitNextLoop) {
          console.log(`agent run ID ${agentRunID} finished!`);
          break;
        }
        if (await contract.isRunFinished(agentRunID)) {
          exitNextLoop = true;
        }
      }
      //   if (receipt && receipt.status) {
      //     conversation.current = [
      //       ...message,
      //       {
      //         content: input,
      //         role: "user",
      //         transactionHash: receipt.hash,
      //       },
      //     ];

      //     if (chatId) {
      //       if (currentChatRef?.current) {
      //         // TODO: does this work?
      //         currentChatRef.current.chatId = chatId;
      //       }

      //       while (true) {
      //         const newMessages: ChatMessage[] = await getNewMessages(
      //           contract,
      //           chatId,
      //           conversation.current.length
      //         );
      //         if (newMessages) {
      //           const lastMessage = newMessages.at(-1);
      //           if (lastMessage) {
      //             if (lastMessage.role == "assistant") {
      //               conversation.current = [
      //                 ...conversation.current,
      //                 { content: lastMessage.content, role: "assistant" },
      //               ];
      //               break;
      //             } else {
      //               // Simple solution to show function results, not ideal
      //               conversation.current = [
      //                 ...conversation.current,
      //                 { content: lastMessage.content, role: "user" },
      //               ];
      //             }
      //           }
      //         }
      //         await new Promise((resolve) => setTimeout(resolve, 2000));
      //       }
      //     }
      //   }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const claimData = {
      claims,
      explanation,
      account
    };
    console.log("Claim Data:", claimData);
    try {
        toast.promise(createClaim(claimData), {
          loading: "Saving...",
          success: <b>Claimed send!</b>,
          error: <b>Could not send.</b>
        });
      // await sendWeb3Claim();
    } catch (error) {
      console.log("error", error);
      toast.error("Error sending claim");
    }
  };

  return (
    <div className="claim-form">
      <h1>Insurance Claim Form</h1>
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

export default ClaimModal;
