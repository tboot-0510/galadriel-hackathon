import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const { claims, explanation, account } = body;
  console.log("account", account);

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

  const claim = await prisma.claim.create({
    data: {
      userId: user.id,
      description: explanation,
    },
  });

  return Response.json({ claim: claim.id }, { status: 200 });
}
