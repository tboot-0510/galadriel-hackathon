import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const { userId, value } = body;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { estimatedPremium: value },
    });
    return Response.json({ status: 200 });
  } catch (error) {
    console.error("Error upserting user:", error);
    throw error;
  }
}
