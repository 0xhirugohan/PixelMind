import Header from "../components/header"; // Adjust the path based on your file structure
import "./Home.css";

const Home = () => (
  <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
    {/* Use the Header component */}
    <Header />

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
