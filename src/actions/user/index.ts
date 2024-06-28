export const upsertUser = async ({ account }: { account: string }) => {
  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ account }),
  };

  const url = `/api/user`;
  const data = await fetch(url, options);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};

export const addLandUser = async ({
  account,
  land,
}: {
  account: string;
  land: any;
}) => {
  let options = {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ account, land }),
  };

  const url = `/api/user`;
  const data = await fetch(url, options);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};

export const getUser = async (account: string) => {
  const url = `${process.env.VERCEL_URL}/api/user?account=${account}`;
  const data = await fetch(url);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};
