export const generateArt = async (prompt: string) => {
  const response = await fetch("/input-art-prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate art");
  }

  return await response.json();
};
