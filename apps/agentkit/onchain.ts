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
            // chain: "0x14a34", // base sepolia
            chain: "0x1", // ethereum mainnet
            format: "hex",
            limit: 10,
            mediaItems: false,
            address: address,
        });

        const nfts: any[] = response.result;
        const images = nfts.map((nft) => {
            const imageUri = nft?.metadata?.image || nft?.image || "";
            return imageUri.replace(
                "ipfs://",
                "https://ipfs.moralis.io:2053/ipfs/",
            );
        });
        const filtered: string[] = images.filter((image) => {
            const isPng = image.indexOf(".png") != -1;
            const isJpg = image.indexOf(".jpg") != -1;
            const isJpeg = image.indexOf(".jpeg") != -1;
            const isGif = image.indexOf(".gif") != -1;
            const isWebp = image.indexOf(".webp") != -1;
            return isPng || isJpg || isGif || isWebp;
        });
        const existed: string[] = [];
        for (const image of filtered) {
            const response = await fetch(image, {
                method: "HEAD",
            });
            if (response.status === 200) existed.push(image);
        }
        return existed;
    } catch (err) {
        console.error("Unable to get list of NFT by address");
        console.error(err);
        return [];
    }
}
