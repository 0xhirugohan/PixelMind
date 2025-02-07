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
import * as fs from "fs";
import * as readline from "readline";

dotenv.confg();

// Configure a file to persist the agent's CDP MPC Wallet Data
const WALLET_DATA_FILE = "wallet_data.txt";

/**
 * Validates that required environment variable are set
 *
 * @throws {Error} - If required environment variables are missing
 * @returns {void}
 */
function validateEnvionment(): void {
	const missingVars: string[] = [];

	// check required variables
	const requiredVars = ["OPENAI_API_KEY", "CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY"];
	requiredVars.forEach(varName => {
		if (!process.env[varName]) {
			missingVars.push(varName);
		}
	});

	// Exit if any required variables are missing
	if (missingVars.length > 0) {
		console.log("Error: Required environment variables are not set");
		missingVars.forEach(varName => {
			console.error(`${varName}=your_${varName.toLowerCase()}_here`);
		});
		process.exit(1);
	}

	// Warn about optional NETWORK_ID
	if (!process.env.NETWORK_ID) {
		console.warn("Warning: NETWORK_ID not set, defaulting to base-sepolia testnet");
	}
}

// Add this right after imports and before any other code
validateEnvironment();

/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
async function initializeAgent() {
	try {
		// Initialize LLM
		const llm = new ChatOpenAI({
			model: "gpt-4o-mini",
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

		const cdpApiKeyPrivateKey = process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n");
		// Configure CDP Wallet Provider
		const config = {
			apiKeyName: process.env.CDP_API_KEY_NAME,
			apiKeyPrivateKey: cdpApiKeyPrivateKey,
			cdpWalletData: walletDataStr || undefined,
			networkId: process.env.NETWORK_ID || "base-sepolia",
		};

		const walletProvider = await CdpWalletProvider.configureWithWallet(config);

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
			messageModifier: ``,
		});
	} catch (error) {
		console.error("Failed to initialize agent:", error);
		throw error; // Re-throw to be handled by caller
	}
}

/**
 * Start the chatbot agent
 */
async function main() {
    try {
        console.log("Hello World!");
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
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
