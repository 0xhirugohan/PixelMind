import { Web3Button } from "@web3modal/react";
import { useAccount } from "wagmi";

export function ConnectWallet() {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>

      {/* ✅ Connect Wallet Button */}
      <Web3Button />

      {/* ✅ Show Connection Status */}
      {isConnected && <p className="mt-4 text-green-400">Connected ✅</p>}
    </div>
  );
}

export default ConnectWallet;
