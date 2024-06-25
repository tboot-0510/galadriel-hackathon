import type { NextApiRequest, NextApiResponse } from "next";

export async function POST(request: NextApiRequest, response: NextApiResponse) {
  const body = await request.json();

  const { claims, explanation } = body;

  return Response.json(
    { message: "Claim submitted successfully" },
    { status: 200 }
  );
}
