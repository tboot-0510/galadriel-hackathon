import { ABI } from "@/abis/agent";
import { Wallet } from "ethers";
import { Contract, ethers, TransactionReceipt } from "ethers";

interface Message {
  role: string;
  content: string;
}

export const getProvider = () => {
  return new ethers.JsonRpcProvider(process.env.RPC_URL);
};
export const getWallet = () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const privateKey = process.env.PRIVATE_KEY_GALADRIEL;
  const wallet = new Wallet(privateKey, provider);
  return wallet;
};

export const getContract = () => {
  const wallet = getWallet();
  return new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, ABI, wallet);
};

export async function getNewMessages(
  contract: Contract,
  agentRunID: number,
  currentMessagesCount: number
): Promise<Message[]> {
  const messages = await contract.getMessageHistoryContents(agentRunID);
  const roles = await contract.getMessageHistoryRoles(agentRunID);

  const newMessages: Message[] = [];
  messages.forEach((message: any, i: number) => {
    if (i >= currentMessagesCount) {
      newMessages.push({
        role: roles[i],
        content: messages[i],
      });
    }
  });
  return newMessages;
}

export function getAgentRunId(receipt: TransactionReceipt, contract: Contract) {
  let agentRunID;
  for (const log of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(log);
      if (parsedLog && parsedLog.name === "AgentRunCreated") {
        // Second event argument
        agentRunID = ethers.toNumber(parsedLog.args[1]);
      }
    } catch (error) {
      // This log might not have been from your contract, or it might be an anonymous log
      console.log("Could not parse log:", log);
    }
  }
  return agentRunID;
}
