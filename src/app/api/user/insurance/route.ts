import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const { account, value } = body;

  try {
    await prisma.user.update({
      where: { address: account },
      data: { insuredValue: value },
    });
    return Response.json({ status: 200 });
  } catch (error) {
    console.error("Error upserting user:", error);
    throw error;
  }
}
