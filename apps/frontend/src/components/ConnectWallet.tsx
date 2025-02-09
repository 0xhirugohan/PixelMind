import { WagmiProvider } from "wagmi";
import { Web3Modal, Web3Button } from "@web3modal/react";
import { useAccount } from "wagmi";
import { config } from "../config"; // ✅ Import Wagmi config

export function ConnectWallet() {
  const { isConnected } = useAccount();

  return (
    <WagmiProvider config={config}>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>

        {/* ✅ Web3Modal Setup */}
        <Web3Modal projectId={process.env.WALLETCONNECT_PROJECT_ID!} />

        {/* ✅ Connect Wallet Button */}
        <Web3Button />

        {/* ✅ Show Connection Status */}
        {isConnected && <p className="mt-4 text-green-400">Connected ✅</p>}
      </div>
    </WagmiProvider>
  );
}

export default ConnectWallet;
