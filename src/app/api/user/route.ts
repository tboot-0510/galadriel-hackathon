import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const { account } = body;

  try {
    const user = await prisma.user.upsert({
      where: { address: account },
      update: {},
      create: { address: account, role: "USER" },
    });
    return Response.json({ userId: user.id }, { status: 200 });
  } catch (error) {
    console.error("Error upserting user:", error);
    throw error;
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const { account, land } = body;

  try {
    const user = await prisma.user.upsert({
      where: { address: account },
      update: { landCoordinates: land },
      create: { address: account, role: "USER", landCoordinates: land },
    });
    return Response.json({ userId: user.id }, { status: 200 });
  } catch (error) {
    console.error("Error upserting user:", error);
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
    include: {
      premiums: true,
      claims: true,
    },
  });

  if (!user) {
    return Response.json(
      { message: `Missing user for ${account}` },
      { status: 400 }
    );
  }
  return Response.json({ user }, { status: 200 });
}
