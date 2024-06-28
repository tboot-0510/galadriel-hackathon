export const createClaim = async (claimData: any) => {
  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(claimData),
  };

  const url = `/api/claims`;
  const data = await fetch(url, options);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};

export const updateClaim = async (claimData: any) => {
  let options = {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(claimData),
  };

  const url = `/api/claims`;
  const data = await fetch(url, options);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};

export const getClaims = async (account: string) => {
  const url = `/api/claims?account=${account}`;
  const data = await fetch(url, {
    cache: "no-store",
  });

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};
