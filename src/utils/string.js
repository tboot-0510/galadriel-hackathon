function separateString({ numberDisplayed, string }) {
  if (!string?.length) return;

  const idLength = string?.length;
  const start = string.substring(0, numberDisplayed);
  const end = string.substring(idLength - numberDisplayed, idLength);

  return {
    start,
    end,
  };
}

function truncateWalletAddress({ numberDisplayed, string }) {
  const formattedString = separateString({ numberDisplayed, string });
  return `${formattedString?.start}...${formattedString?.end}`;
}

function formatString(string, numberDisplayed) {
  const formattedString = separateString(numberDisplayed, string);
  return `${formattedString?.start}`;
}

export { truncateWalletAddress, formatString };
