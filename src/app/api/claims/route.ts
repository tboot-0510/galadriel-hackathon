import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const { claims, explanation, account, tx, runId } = body;

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
      transactionHash: tx,
    },
  });

  return Response.json({ claimId: claim.id }, { status: 200 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const account = searchParams.get("account");

  if (id) {
    const claim = await prisma.claim.findFirst({
      where: {
        user: {
          address: account,
        },
      },
    });
    return Response.json({ claim }, { status: 200 });
  }

  const claims = await prisma.claim.findMany({
    where: {
      user: {
        address: account,
      },
    },
  });
  return Response.json({ claims }, { status: 200 });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const { id, transactionHash, runId, account } = body;

  if (!id) {
    return Response.json({ message: "Claim ID is required" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      address: account,
    },
  });

  if (!user) {
    return Response.json(
      { message: `Missing user for ${account}` },
      { status: 404 }
    );
  }

  const existingClaim = await prisma.claim.findFirst({
    where: {
      id: id,
      userId: user.id,
    },
  });

  if (!existingClaim) {
    return Response.json(
      { message: `No claim found for ID ${id} and user ${account}` },
      { status: 404 }
    );
  }

  const updatedClaim = await prisma.claim.update({
    where: {
      id: id,
    },
    data: {
      transactionHash,
      runId,
    },
  });

  return new Response(JSON.stringify({ updatedClaim }), { status: 200 });
}
