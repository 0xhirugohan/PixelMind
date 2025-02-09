import { useConnect } from "wagmi";

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <div>
      <h2>Select a Wallet</h2>
      {connectors.map((connector) => (
        <button key={connector.id} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      ))}
    </div>
  );
}
