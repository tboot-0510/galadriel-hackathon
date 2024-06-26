export const createUser = async (userData: any) => {
  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(userData),
  };

  const url = `/api/users`;
  const data = await fetch(url, options);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
};
