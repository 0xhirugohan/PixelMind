import Header from "../components/header"; // Adjust the path

const ConnectWallet = () => (
  <div className="bg-gray-900 text-white min-h-screen">
    <Header />
    <main className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
      <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
        Connect Wallet
      </button>
    </main>
  </div>
);

export default ConnectWallet;
