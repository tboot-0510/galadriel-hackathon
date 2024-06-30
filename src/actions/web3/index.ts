import { getAgentRunId, getContract, getNewMessages } from "@/lib/web3/agent";

export const getTxMessages = async (tx: any) => {
  const url = `/api/tx?tx=${tx}`;
  const data = await fetch(url, { cache: "no-cache" });

  if (!data.ok) {
    throw new Error(`Failed to fetch data : ${url}`);
  }

  return data.json();
};

export const getAgentId = (receipt: any) => {
  const contract = getContract();
  return getAgentRunId(receipt, contract);
};
