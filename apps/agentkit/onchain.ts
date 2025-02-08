/**
 * Functions to retrieve Onchain Data from Offchain Providers
 */
import Moralis from "moralis";

/**
 * Get List of NFT owned by an address
 *
 * @param apiKey - Moralis API key
 * @param address - The user or wallet address
 * @returns An array of NFT metadata
 */
export async function getListNFTByAddress(
    apiKey: string,
    address: string,
): Promise<any[]> {
    console.log("running getListNFTByAddress...");

    try {
        await Moralis.start({
            apiKey,
        });

        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            chain: "0x14a34",
            format: "hex",
            limit: 5,
            mediaItems: false,
            address: address,
        });

        const nfts: any[] = response.result;
        const metadatas = nfts.map((nft) => nft.metadata);
        return metadatas;
    } catch (err) {
        console.error("Unable to get list of NFT by address");
        console.error(err);
        return [];
    }
}
