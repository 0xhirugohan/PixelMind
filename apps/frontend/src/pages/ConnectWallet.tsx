import React, { useState } from "react";
import { useConnect, useAccount } from "wagmi";
import Header from "../components/header"; // Adjust the path

const ConnectWallet = () => {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const [selectedConnector, setSelectedConnector] = useState("");

  const handleWalletChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedConnector(event.target.value);
  };

  const handleConnectWallet = () => {
    const connector = connectors.find((c) => c.id === selectedConnector);
    if (connector) {
      connect({ connector });
    } else {
      alert("Please select a wallet");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
        <select
          className="mt-6 px-6 py-3 bg-gray-800 text-white rounded-lg"
          value={selectedConnector}
          onChange={handleWalletChange}
        >
          <option value="" disabled>
            Select a Wallet
          </option>
          {connectors.map((connector) => (
            <option key={connector.id} value={connector.id}>
              {connector.name}
            </option>
          ))}
        </select>
        <button
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          onClick={handleConnectWallet}
        >
          Connect Wallet
        </button>
        {address && <p className="mt-4">Connected as: {address}</p>}
      </main>
    </div>
  );
};

export default ConnectWallet;
