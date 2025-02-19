import {
    AgentKit,
    CdpWalletProvider,
    wethActionProvider,
    walletActionProvider,
    erc20ActionProvider,
    cdpApiActionProvider,
    cdpWalletActionProvider,
    pythActionProvider,
} from "@coinbase/agentkit";

import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "node:fs";
import * as readline from "node:readline";

import OpenAI from "openai";
import Moralis from "moralis";

import { getListNFTByAddress } from "./onchain";
import { describeImage, generateImage } from "./openai";

dotenv.config();

// Configure a file to persist the agent's CDP MPC Wallet Data
const WALLET_DATA_FILE = "wallet_data.txt";

/**
 * Validates that required environment variable are set
 *
 * @throws {Error} - If required environment variables are missing
 * @returns {void}
 */
function validateEnvironment(): void {
    const missingVars: string[] = [];

    // check required variables
    const requiredVars = [
        "OPENAI_API_KEY",
        "CDP_API_KEY_NAME",
        "CDP_API_KEY_PRIVATE_KEY",
        "MORALIS_API_KEY",
    ];
    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    }

    // Exit if any required variables are missing
    if (missingVars.length > 0) {
        console.log("Error: Required environment variables are not set");
        for (const varName of missingVars) {
            console.error(`${varName}=your_${varName.toLowerCase()}_here`);
        }
        process.exit(1);
    }

    // Warn about optional NETWORK_ID
    if (!process.env.NETWORK_ID) {
        console.warn(
            "Warning: NETWORK_ID not set, defaulting to base-sepolia testnet",
        );
    }
}

// Add this right after imports and before any other code
validateEnvionment();

/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
export async function initializeAgent() {
    try {
        // Initialize LLM
        const llm = new ChatOpenAI({
            model: "gpt-4o-mini",
        });
        const openai = new OpenAI();

        const apiKey = process.env.MORALIS_API_KEY || "";
        await Moralis.start({
            apiKey,
        });

        let walletDataStr: string | null = null;

        // Read existing wallet data if available
        if (fs.existsSync(WALLET_DATA_FILE)) {
            try {
                walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
            } catch (error) {
                console.error("Error reading wallet data:", error);
                // Continue without wallet data
            }
        }

        const cdpApiKeyPrivateKey =
            process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n");
        // Configure CDP Wallet Provider
        const config = {
            apiKeyName: process.env.CDP_API_KEY_NAME,
            apiKeyPrivateKey: cdpApiKeyPrivateKey,
            cdpWalletData: walletDataStr || undefined,
            networkId: process.env.NETWORK_ID || "base-sepolia",
        };

        const walletProvider =
            await CdpWalletProvider.configureWithWallet(config);

        // Initialize AgentKit
        const agentkit = await AgentKit.from({
            walletProvider,
            actionProviders: [
                wethActionProvider(),
                pythActionProvider(),
                walletActionProvider(),
                erc20ActionProvider(),
                cdpApiActionProvider({
                    apiKeyName: process.env.CDP_API_KEY_NAME,
                    apiKeyPrivateKey: cdpApiKeyPrivateKey,
                }),
                cdpWalletActionProvider({
                    apiKeyName: process.env.CDP_API_KEY_NAME,
                    apiKeyPrivateKey: cdpApiKeyPrivateKey,
                }),
            ],
        });

        const tools = await getLangChainTools(agentkit);

        // Store buffered conversation history in memory
        const memory = new MemorySaver();
        const agentConfig = {
            configurable: {
                thread_id: "CDP AgentKit Chatbot Example!",
            },
        };

        // Create React Agent using the LLM and CDP AgentKit tools
        const agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: memory,
            messageModifier: `
				You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. 
				You are empowered the Vision from OpenAI to read and see through images.
				You are empowered to interact onchain using your tools. 
				If you ever need funds, you can request them from the faucet if you are on network ID 'base-sepolia'. 
				If not, you can provide your wallet details and request funds from the user.
				Before executing your first action, get the wallet details to see what network you're on. 
				If there is a 5XX (internal) HTTP error code, ask the user to try again later. 
				If someone asks you to do something you can't do with your currently available tools, you must say so, and encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to docs.cdp.coinbase.com for more information. 
				Be concise and helpful with your responses. 
				Refrain from restarting your tools' descriptions unless it is explicitly requested.
			`,
        });

        // Save wallet data
        const exportedWallet = await walletProvider.exportWallet();
        fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));

        return { agent, config: agentConfig, openai };
    } catch (error) {
        console.error("Failed to initialize agent:", error);
        throw error; // Re-throw to be handled by caller
    }
}

/**
 * Run the agent autonomously with specified intervals
 */
async function runAutonomousMode(agent: any, config: any, interval = 10) {
    console.log("Starting autonomous mode...");

    while (true) {
        try {
            const thought =
                "Be creative and do something interesting on the blockchain. " +
                "Choose an action or set of actions and execute it that highlights your abilities.";

            const stream = await agent.stream(
                {
                    messages: [new HumanMessage(thought)],
                },
                config,
            );

            for await (const chunk of stream) {
                if ("agent" in chunk) {
                    console.log(chunk.agent.messages[0].content);
                } else if ("tools" in chunk) {
                    console.log(chunk.tools.messages[0].content);
                }
                console.log("-------------------");
            }

            await new Promise((resolve) =>
                setTimeout(resolve, interval * 1000),
            );
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error:", error.message);
            }
            process.exit(1);
        }
    }
}

/**
 * Run the agent interactively based on user input
 */
async function runChatMode(agent: any, config: any) {
    console.log("Starting chat mode... Type 'exit' to end.");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const question = (prompt: string): Promise<string> =>
        new Promise((resolve) => rl.question(prompt, resolve));

    try {
        while (true) {
            const userInput = await question("\nPrompt: ");

            if (userInput.toLowerCase() === "exit") {
                break;
            }

            const stream = await agent.stream(
                {
                    messages: [new HumanMessage(userInput)],
                },
                config,
            );

            for await (const chunk of stream) {
                if ("agent" in chunk) {
                    console.log(chunk.agent.messages[0].content);
                } else if ("tools" in chunk) {
                    console.log(chunk.tools.messages[0].content);
                }
                console.log("--------------------");
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        }
    } finally {
        rl.close();
    }
}

/**
 * Choose whether to run in autonomous or chat mode
 */
async function chooseMode(): Promise<"chat" | "auto"> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const question = (prompt: string): Promise<string> =>
        new Promise((resolve) => rl.question(prompt, resolve));

    while (true) {
        console.log("\nAvailable modes:");
        console.log("1. chat	- Interactive chat mode");
        console.log("2. auto	- Autonomous action mode");

        const choice = (
            await question("\nChoose a mode (enter number or name): ")
        )
            .toLowerCase()
            .trim();

        if (choice === "1" || choice === "chat") {
            rl.close();
            return "chat";
        } else if (choice === "2" || choice === "auto") {
            rl.close();
            return "auto";
        }
        console.log("Invalid choice. Please try again.");
    }
}

/**
 * Start the chatbot agent
 */
async function main() {
    try {
        const { agent, config, openai } = await initializeAgent();
        const apiKey = process.env.MORALIS_API_KEY || "";
        await Moralis.start({
            apiKey,
        });

        // example of end to end process
        const address = "0xe5c3A3bad46475dD53100CdBecB0a7541aBA0391";
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

        /*
        const mode = await chooseMode();

        if (mode === "chat") {
            await runChatMode(agent, config);
        } else {
            await runAutonomousMode(agent, config);
        }
	   */
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        }
        process.exit(1);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  console.log("Starting Agent...");
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
