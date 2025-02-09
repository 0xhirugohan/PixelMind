import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi"; // Use WagmiConfig for the latest version
import { config } from "./config";
import Home from "./pages/Home";
import ConnectWallet from "./pages/ConnectWallet";
import FetchNFTs from "./pages/FetchNFTs";
import InputArtPrompt from "./pages/InputArtPrompt";
import GeneratedArtwork from "./pages/GeneratedArtwork";

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connect-wallet" element={<ConnectWallet />} />
          <Route path="/fetch-nfts" element={<FetchNFTs />} />
          <Route path="/input-art-prompt" element={<InputArtPrompt />} />
          <Route path="/generated-artwork" element={<GeneratedArtwork />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
