import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const { userId, value, tx, date } = body;

  try {
    const existingDeposit = await prisma.premium.findFirst({
      where: {
        userId,
        dateOfDeposit: date,
      },
    });

    if (existingDeposit) {
      return Response.json({
        status: 400,
        message: "Deposit already exists for the specified date",
      });
    }

    await prisma.premium.create({
      data: { userId, tx, value, dateOfDeposit: date },
    });
    return Response.json({ status: 200 });
  } catch (error) {
    console.error("Error creating premium payment:", error);
    throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const account = searchParams.get("account");

  const user = await prisma.user.findFirst({
    where: {
      address: account,
    },
  });

  if (!user) {
    return Response.json(
      { message: `Missing user for ${account}` },
      { status: 400 }
    );
  }

  const premiums = await prisma.premium.findMany({
    where: {
      userId: user.id,
    },
    take: 2,
  });

  return Response.json({ premiums }, { status: 200 });
}
