import { createPublicClient, http, parseAbi } from "viem";
import { sepolia } from "viem/chains";

const COUNTRY_NFT_ADDRESS = "0x5bc8a05eDA72B75804d132C4EaAC64e7760D1738";
const WALLET_ADDRESS = "0xc0C71F52149C26D7718a6C257aAb185908dB79a8"; // Your wallet

const nftAbi = parseAbi([
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function totalMinted() view returns (uint256)"
]);

const client = createPublicClient({
  chain: sepolia,
  transport: http("https://ethereum-sepolia.publicnode.com")
});

async function checkNFT() {
  try {
    console.log("Checking NFT ownership for wallet:", WALLET_ADDRESS);
    
    // Check balance
    const balance = await client.readContract({
      address: COUNTRY_NFT_ADDRESS as `0x${string}`,
      abi: nftAbi,
      functionName: "balanceOf",
      args: [WALLET_ADDRESS as `0x${string}`]
    });
    
    console.log("NFT Balance:", balance.toString());
    
    // Check owner of token ID 1
    try {
      const owner1 = await client.readContract({
        address: COUNTRY_NFT_ADDRESS as `0x${string}`,
        abi: nftAbi,
        functionName: "ownerOf",
        args: [BigInt(1)]
      });
      console.log("Owner of Token ID 1:", owner1);
    } catch (e) {
      console.log("Token ID 1 not minted yet");
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}

checkNFT();
