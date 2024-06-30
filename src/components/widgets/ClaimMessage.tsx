"use client"

import { useEffect, useState } from "react";
import { getAgentRunId, getNewMessages } from "@/lib/web3/agent";
import { Contract } from "ethers";
import { RiRobot2Line } from 'react-icons/ri'
import { ABI } from "@/abis/agent";
import { BrowserProvider } from "ethers";
import { useRouter } from "next/navigation";
import { Loading } from "../ui/Loading";

const explanationText = {
  "IMPOSSIBLE": "You will be penalized by an increase in your premium",
  "NEED_VERIFICATION": "This requires additional human intervention, in the meantime, the insurance money has been moved to an escrow account"
}

export default function ClaimMessage({ tx }: any) {
    const router = useRouter();
    const [allMessages, setAllMessages] = useState([]);
    const [conclusion, setConclusion] = useState("");
    const [loading, setLoading]= useState(false);

    const fetchMessages = async (contract: Contract, agentRunId: number) => {
        let exitNextLoop = false;
        const messages = [];
        while (true) {
          try {
            let newMessages = await getNewMessages(contract, agentRunId, messages.length);
            newMessages = newMessages.filter((msg) => msg.role === "assistant");
            if (newMessages && newMessages.length > 0) {
                setLoading(false);
                try {
                  const {analysis, conclusion} = JSON.parse(newMessages[0].content);
                  messages.push(...newMessages);
                  setAllMessages([{content: analysis.concat(conclusion)}]);
                  setConclusion(conclusion);
                  
                } catch (e){
                  messages.push(...newMessages);
                  setAllMessages(newMessages);
                }
                exitNextLoop = true
            }
      
            await new Promise((resolve) => setTimeout(resolve, 2000));
      
            if (exitNextLoop || await contract.isRunFinished(agentRunId)) {
              console.log(`Agent run ID ${agentRunId} finished!`);
              router.refresh();
              break;
            }
          } catch (error) {
            console.error('Error fetching messages:', error);
          }
        }
      };

      useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const pollTransactionReceipt = async () => {
            const {ethereum} = window as any;
            const ethersProvider = new BrowserProvider(ethereum);
            const signer = await ethersProvider.getSigner();
            const contract = new Contract(
                process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
                ABI,
                signer
            );
            const receipt = await ethersProvider.getTransactionReceipt(tx);
            console.log("claim receipt", receipt);
            if (!receipt) {
              timeoutId = setTimeout(pollTransactionReceipt, 2000);
            return;
            }
            
            const agentRunId = getAgentRunId(receipt, contract);
            console.log("tx", tx, "agentRunId", agentRunId);
            fetchMessages(contract, agentRunId);
        };
        if (tx){
            setLoading(true);
            pollTransactionReceipt();
        }

        return () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        };
        
      }, [tx]);

    return (
        <div className="flex flex-col">
            {loading && <Loading />}
            {allMessages?.map((message:any, idx:number) => (
                <div key={idx} className="flex flex-row mb-5 text-black">
                    <div className="flex items-center justify-center inline-block h-8 w-8 rounded-full ring-2 ring-white mr-4 min-w-[32px]" style={{backgroundColor:"green", borderRadius: "50%"}}>
                        <RiRobot2Line className="size-4" color="white"/>
                    </div>
                    {message.content}
                </div>
            ))}
            {conclusion && (
              <div className="my-2 block rounded bg-zinc-100 px-7 pb-3.5 pt-4 text-xs font-medium leading-tight text-neutral-500 data-[twe-nav-active]:!bg-primary-100 data-[twe-nav-active]:text-primary-700 dark:bg-neutral-700 dark:text-white/50 dark:data-[twe-nav-active]:!bg-slate-900 dark:data-[twe-nav-active]:text-primary-500 md:me-4">
                <p className="uppercase">{conclusion}</p>
                <div>
                  {explanationText[conclusion]}
                 </div> 
              </div>
            )}
        </div>
        )
}