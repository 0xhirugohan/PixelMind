// Fetch NFTs by wallet address
export const fetchNFTs = async (walletAddress: string) => {
  const response = await fetch("/fetch-nfts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ walletAddress }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch NFTs");
  }

  return await response.json(); // Assuming the API returns an object with NFTs
};

// Generate art based on a prompt
export const generateArt = async (prompt: string) => {
  const response = await fetch("/input-art-prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate art");
  }

  return await response.json();
};
