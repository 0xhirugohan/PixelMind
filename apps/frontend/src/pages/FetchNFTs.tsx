import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchNFTsFromGraph } from "../utills/theGraph";
import { NFT } from "../types/nft"; // Import the NFT type

const FetchNFTs = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [nfts, setNFTs] = useState<NFT[]>([]); // Specify the state type as an array of NFT objects
  const navigate = useNavigate();

  const handleFetchNFTs = async () => {
    try {
      const data: NFT[] = await fetchNFTsFromGraph(walletAddress);
      setNFTs(data); // Update state with fetched NFTs
      navigate("/input-art-prompt"); // Redirect to the next step
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
        {nfts.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold">Fetched NFTs:</h2>
            {nfts.map((nft, index) => (
              <div key={index} className="mt-2">
                <p>ID: {nft.tokenID}</p>
                <p>Owner: {nft.owner.id}</p>
                <a
                  href={nft.tokenURI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400"
                >
                  View Metadata
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No NFTs fetched yet.</p>
        )}
      </div>
    </div>
  );
};

export default FetchNFTs;
