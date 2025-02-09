// src/components/Header.tsx
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-between items-center px-10 py-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-purple-400">DigitalArtMind</h1>
      <nav className="flex space-x-6">
        <Link to="/" className="hover:text-purple-400">
          Home
        </Link>
        <Link to="/connect-wallet" className="hover:text-purple-400">
          Connect Wallet
        </Link>
        <Link to="/fetch-nfts" className="hover:text-purple-400">
          Fetch NFTs
        </Link>
      </nav>
    </header>
  );
};

export default Header;
