import "./Home.css";

const Home = () => (
  <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
    {/* Header Section */}
    <header className="flex justify-between items-center px-10 py-6">
      <h1 className="text-3xl font-bold text-purple-400">DigitalArtMind</h1>
      <a
        href="/connect-wallet"
        className="bg-purple-500 px-6 py-2 rounded-lg text-white hover:bg-purple-400"
      >
        Get Started
      </a>
    </header>

    {/* Hero Section */}
    <main className="flex flex-col items-center text-center px-6 py-16">
      <h1 className="text-6xl font-extrabold text-purple-400">AI + NFT</h1>
      <p className="text-4xl mt-4 font-semibold">Mint Your Imagination</p>
      <p className="mt-6 max-w-4xl text-lg text-gray-300">
        Digital Art Minded AI Agent which can learn, inspire, and craft based on
        NFT's art styles 🤩 🎨
      </p>

      <section className="py-16">
        <div className="flex justify-center mt-12">
          <div className="relative w-96 h-96 bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <img
              src="src/assets/nft-image.jpg"
              alt="NFT Artwork"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default Home;
