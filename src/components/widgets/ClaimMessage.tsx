"use client"

import { SetStateAction, useCallback, useEffect, useState } from "react";
import { getAgentRunId, getNewMessages } from "@/lib/web3/agent";
import { Contract } from "ethers";
import {RiRobot2Line} from 'react-icons/ri'
import { ABI } from "@/abis/agent";
import { BrowserProvider } from "ethers";

interface Message {
    role: string;
    content: string;
  }

export default function ClaimMessage({ tx }: any) {
    const [allMessages, setAllMessages] = useState([]);

    const fetchMessages = async (contract: Contract, agentRunId: number) => {
        let exitNextLoop = false;
        const messages = [];
        while (true) {
          try {
            let newMessages = await getNewMessages(contract, agentRunId, messages.length);
            newMessages = newMessages.filter((msg) => msg.role === "assistant");
      
            if (newMessages && newMessages.length > 0) {
                messages.push(...newMessages);
                setAllMessages(newMessages);
            }
      
            await new Promise((resolve) => setTimeout(resolve, 2000));
      
            if (exitNextLoop || await contract.isRunFinished(agentRunId)) {
              console.log(`Agent run ID ${agentRunId} finished!`);
              break;
            }
          } catch (error) {
            console.error('Error fetching messages:', error);
          }
        }
      };

      useEffect(() => {
        const pollTransactionReceipt = async () => {
            const ethersProvider = new BrowserProvider(window.ethereum);
            const signer = await ethersProvider.getSigner();
            const contract = new Contract(
                process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
                ABI,
                signer
            );
            const receipt = await ethersProvider.getTransactionReceipt(tx);
            if (!receipt) {
                setTimeout(pollTransactionReceipt, 2000);
            return;
            }
    
            const agentRunId = getAgentRunId(receipt, contract);
            fetchMessages(contract, agentRunId);
        };
        if (tx){
            pollTransactionReceipt();
        }
        
      }, [tx]);

    return (
        <div className="flex flex-col">
            {allMessages?.map((message:any, idx:number) => (
                <div key={idx} className="flex flex-row mb-5 text-black">
                    <div className="flex items-center justify-center inline-block h-8 w-8 rounded-full ring-2 ring-white mr-4 min-w-[32px]" style={{backgroundColor:"green", borderRadius: "50%"}}>
                        <RiRobot2Line className="size-4" color="white"/>
                    </div>
                    
                    {message.content}
                </div>
            ))}
        </div>
        )
}