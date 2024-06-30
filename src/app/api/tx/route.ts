import {
  getAgentRunId,
  getContract,
  getNewMessages,
  getProvider,
} from "@/lib/web3/agent";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tx = searchParams.get("tx");

  if (!tx) return;

  const provider = getProvider();
  const receipt = await provider.getTransactionReceipt(tx);
  const contract = getContract();
  const agentRunId = getAgentRunId(receipt, contract);
  console.log("agentRunId", agentRunId);

  let newMessages = await getNewMessages(contract, agentRunId, 0);
  newMessages = newMessages.filter((msg) => msg.role === "assistant");

  if (newMessages && newMessages.length > 0) {
    return Response.json({ status: "finished", newMessages }, { status: 200 });
  }

  return Response.json({ status: "pending" }, { status: 200 });
}
