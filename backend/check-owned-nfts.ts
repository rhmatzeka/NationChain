import { createPublicClient, http, parseAbi } from "viem";
import { sepolia } from "viem/chains";

const COUNTRY_NFT_ADDRESS = "0x5bc8a05eDA72B75804d132C4EaAC64e7760D1738";
const WALLET_ADDRESS = "0xc0C71F52149C26D7718a6C257aAb185908dB79a8";

const nftAbi = parseAbi([
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function getCountry(uint256 tokenId) view returns (string name, string isoCode, (uint256 gdp, uint256 population, uint256 militaryPower, uint256 happiness, uint256 oilReserves, uint256 territory) stats)"
]);

const client = createPublicClient({
  chain: sepolia,
  transport: http("https://ethereum-sepolia.publicnode.com")
});

async function checkOwnedNFTs() {
  console.log("Checking which NFTs are owned by:", WALLET_ADDRESS);
  console.log("Scanning token IDs 1-180...\n");
  
  const owned = [];
  
  for (let tokenId = 1; tokenId <= 180; tokenId++) {
    try {
      const owner = await client.readContract({
        address: COUNTRY_NFT_ADDRESS as `0x${string}`,
        abi: nftAbi,
        functionName: "ownerOf",
        args: [BigInt(tokenId)]
      });
      
      if (owner.toLowerCase() === WALLET_ADDRESS.toLowerCase()) {
        // Get country details
        const country = await client.readContract({
          address: COUNTRY_NFT_ADDRESS as `0x${string}`,
          abi: nftAbi,
          functionName: "getCountry",
          args: [BigInt(tokenId)]
        });
        
        owned.push({
          tokenId,
          name: country[0],
          isoCode: country[1]
        });
        
        console.log(`✅ Token ID ${tokenId}: ${country[0]} (${country[1]})`);
      }
    } catch (e) {
      // Token not minted yet, skip
    }
  }
  
  console.log(`\nTotal NFTs owned: ${owned.length}`);
}

checkOwnedNFTs();
