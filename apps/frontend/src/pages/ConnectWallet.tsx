import { useState } from "react";

const ConnectWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } else {
        alert("MetaMask is not installed!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
      <button
        onClick={connectWallet}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
      >
        Connect Wallet
      </button>
      {walletAddress && (
        <p className="mt-4 text-green-500">Connected: {walletAddress}</p>
      )}
    </div>
  );
};

export default ConnectWallet;
