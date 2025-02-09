import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const WALLETCONNECT_PROJECT_ID = "323bf365ecc6ff9e8bcd09b043196c0d"; // Replace with your actual project ID

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(), // MetaMask and browser wallets
    walletConnect({ projectId: WALLETCONNECT_PROJECT_ID }), // WalletConnect
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
