import { useConnect } from "wagmi";

const WalletModal = () => {
  const { connect, connectors } = useConnect();

  return (
    <div className="wallet-modal">
      <h2 className="text-2xl font-bold text-center text-white mb-6">
        Welcome to NFPrompt.io
      </h2>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg flex items-center justify-center mb-4 hover:bg-gray-800"
          onClick={() => connect({ connector })} // Pass connector as an object
        >
          {connector.name === "MetaMask" ? (
            <>
              <img
                src="https://metamask.io/images/mm-logo.svg"
                alt="Metamask"
                className="w-6 h-6 mr-3"
              />
              MetaMask
            </>
          ) : (
            connector.name
          )}
        </button>
      ))}
    </div>
  );
};

export default WalletModal;
