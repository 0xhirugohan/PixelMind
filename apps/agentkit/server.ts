import express from "express";

import { initializeAgent } from "./chatbot";
import { getListNFTByAddress } from "./onchain";
import { describeImage, generateImage } from "./openai";

const port = 3000;

async function main() {
    try {
        const app = express();

        const { agent, config, openai } = await initializeAgent();

        /*
		// example of end to end process
        const address = "0xe5c3A3bad46475dD53100CdBecB0a7541aBA0391";
        const apiKey = process.env.MORALIS_API_KEY || "";
        const images = await getListNFTByAddress(apiKey, address);
        console.log({ images });
        const artStyleResult = await describeImage(openai, images);
        console.log({ artStyleResult });
        const drawingPrompt = "a physical robot teaches kid a computer";
        const generatedImage = await generateImage(
            openai,
            artStyleResult,
            drawingPrompt,
        );
        console.log({ generatedImage });
	   */

        app.use(express.json());

        app.get("/", (req, res) => {
            res.send("Hello World!");
        });

        app.post("/api/chat", (req, res) => {
            res.status(200).json({ message: "healthz" });
        });

        app.post("/fetch-nfts", async (req, res) => {
            try {
                if (!req.body.address) {
                    res.status(400).json({ message: "address required" });
                } else {
                    const address = req.body.address;
                    const apiKey = process.env.MORALIS_API_KEY || "";
                    const images = await getListNFTByAddress(apiKey, address);
                    res.status(200).json({ data: { images } });
                }
            } catch (err) {
                console.log("err:", err);
                res.status(400).json({ message: "unknown error" });
            }
        });

        app.post("/input-art-prompt", async (req, res) => {
            try {
                if (!req.body.images || req.body.images.length < 1) {
                    res.status(400).json({ message: "valid images required" });
                } else if (!req.body.prompt || req.body.prompt.length < 1) {
                    res.status(400).json({ message: "valid prompt required" });
                } else {
                    const images = req.body.images;
                    const prompt = req.body.prompt;
                    const artStyleResult = await describeImage(openai, images);
                    console.log({ artStyleResult });
                    const generatedImage = await generateImage(
                        openai,
                        artStyleResult,
                        prompt,
                    );
                    console.log({ generatedImage });
                    res.status(200).json({ data: { image: generatedImage } });
                }
            } catch (err) {
                console.log("err:", err);
                res.status(400).json({ message: "unknown error" });
            }
        });

        return app;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        }
        process.exit(1);
    }
}

if (require.main === module) {
    main()
        .then((app) => {
            app.listen(port, () => {
                console.log(`Example app listening on port ${port}`);
            });
        })
        .catch((error) => {
            console.error("Fatal error:", error);
            process.exit(1);
        });
}
