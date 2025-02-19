import { useState } from "react";
import { generateArt } from "../utills/api";

const InputArtPrompt = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");

  const handleGenerateArt = async () => {
    try {
      const data = await generateArt(prompt);
      setGeneratedImage(data.image);
    } catch (error) {
      console.error("Error generating art:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold">Input Art Prompt</h1>
      <textarea
        placeholder="Describe your art idea..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mt-4 px-4 py-2 rounded-lg text-black w-1/2"
      />
      <button
        onClick={handleGenerateArt}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
      >
        Generate Art
      </button>
      {generatedImage && (
        <div className="mt-6">
          <img
            src={generatedImage}
            alt="Generated Art"
            className="w-1/2 rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default InputArtPrompt;
