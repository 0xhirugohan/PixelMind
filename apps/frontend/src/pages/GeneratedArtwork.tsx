import { useState, useEffect } from "react";

const GeneratedArtwork = () => {
  const [artwork, setArtwork] = useState("");

  useEffect(() => {
    // Fetch the generated artwork from the backend
    const fetchArtwork = async () => {
      try {
        const response = await fetch("/generated-artwork", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        setArtwork(data.image);
      } catch (error) {
        console.error("Error fetching artwork:", error);
      }
    };
    fetchArtwork();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold">Generated Artwork</h1>
      {artwork ? (
        <img
          src={artwork}
          alt="Generated Artwork"
          className="mt-6 w-1/2 rounded-lg"
        />
      ) : (
        <p className="mt-4">Fetching your artwork...</p>
      )}
    </div>
  );
};

export default GeneratedArtwork;
