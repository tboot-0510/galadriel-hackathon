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
