import { useState } from "react";

interface NFT {
  name: string;
  description: string;
}

const FetchNFTs = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [nfts, setNFTs] = useState<NFT[]>([]);

  const handleFetchNFTs = async () => {
    try {
      const response = await fetch("/fetch-nfts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      });
      const data = await response.json();
      setNFTs(data.nfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold">Fetch Your NFTs</h1>
      <input
        type="text"
        placeholder="Enter Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="mt-4 px-4 py-2 rounded-lg text-black"
      />
      <button
        onClick={handleFetchNFTs}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
      >
        Fetch NFTs
      </button>
      <div className="mt-6">
        {nfts.map((nft, index) => (
          <div key={index} className="text-white">
            {nft.name} - {nft.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FetchNFTs;
