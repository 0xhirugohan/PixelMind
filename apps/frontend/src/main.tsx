import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { config } from "./config";
import App from "./App"; // Your App component
import "dotenv/config"; // Automatically loads .env variables

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <App />
    </WagmiProvider>
  </React.StrictMode>
);
