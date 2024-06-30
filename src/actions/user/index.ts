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
    throw new Error(`Failed to fetch data : ${url}`);
  }

  return data.json();
};

export const addInsuredValue = async (insuredValue: any) => {
  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(insuredValue),
  };

  const url = `/api/user/insurance`;
  const data = await fetch(url, options);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};

export const createPremiumPayment = async (premiumDetails: any) => {
  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(premiumDetails),
  };

  const url = `/api/user/premiums`;
  const data = await fetch(url, options);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};

export const setUserPremium = async (premiumDetails: any) => {
  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(premiumDetails),
  };

  const url = `/api/user/premiums/set`;
  const data = await fetch(url, options);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};

export const getPremiumData = async ({ account }: { account: string }) => {
  const url = `${process.env.VERCEL_URL}/api/user/premiums?account=${account}`;
  const data = await fetch(url, { next: { revalidate: 60 } });

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};
