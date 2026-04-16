"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, http, parseAbi } from "viem";
import { sepolia } from "viem/chains";
import { Header } from "@/components/Header";
import { useRealtime } from "@/hooks/useRealtime";
import { ExternalLink, Loader2 } from "lucide-react";

const COUNTRY_NFT_ADDRESS = "0x5bc8a05eDA72B75804d132C4EaAC64e7760D1738";

const nftAbi = parseAbi([
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)"
]);

interface NFT {
  tokenId: number;
  name: string;
  image: string;
  attributes: any[];
}

export default function MyNFTsPage() {
  const { address, isConnected } = useAccount();
  const realtime = useRealtime();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) return;

    const loadNFTs = async () => {
      setLoading(true);
      try {
        const client = createPublicClient({
          chain: sepolia,
          transport: http("https://ethereum-sepolia.publicnode.com")
        });

        const nftList: NFT[] = [];

        // Scan all possible token IDs (1-180)
        console.log("Scanning NFTs for address:", address);
        
        for (let tokenId = 1; tokenId <= 180; tokenId++) {
          // Log progress every 20 tokens
          if (tokenId % 20 === 0) {
            console.log(`Progress: ${tokenId}/180 tokens scanned...`);
          }
          
          try {
            const owner = await client.readContract({
              address: COUNTRY_NFT_ADDRESS as `0x${string}`,
              abi: nftAbi,
              functionName: "ownerOf",
              args: [BigInt(tokenId)]
            });

            if (owner.toLowerCase() === address.toLowerCase()) {
              console.log("✅ Found NFT:", tokenId, "Owner:", owner);
              
              const tokenURI = await client.readContract({
                address: COUNTRY_NFT_ADDRESS as `0x${string}`,
                abi: nftAbi,
                functionName: "tokenURI",
                args: [BigInt(tokenId)]
              });

              // Parse data URI
              const jsonBase64 = tokenURI.replace("data:application/json;base64,", "");
              const jsonString = atob(jsonBase64);
              const metadata = JSON.parse(jsonString);

              nftList.push({
                tokenId: tokenId,
                name: metadata.name,
                image: metadata.image,
                attributes: metadata.attributes || []
              });
            }
          } catch (e) {
            // Token not minted or error, skip
          }
        }

        console.log("✅ Scan complete! Total NFTs found:", nftList.length);
        console.log("NFTs:", nftList.map(n => `${n.name} (#${n.tokenId})`).join(", "));
        setNfts(nftList);
      } catch (error) {
        console.error("❌ Error loading NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <main className="min-h-screen">
        <Header onlinePlayers={realtime.onlinePlayers} />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-4xl font-black text-white">My Country NFTs</h1>
          <p className="mt-4 text-slate-400">Please connect your wallet to view your NFTs</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <Header onlinePlayers={realtime.onlinePlayers} />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-black text-white">My Country NFTs</h1>
            <p className="mt-2 text-slate-400">Your on-chain geopolitical assets</p>
          </div>
          <a
            href={`https://sepolia.etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded bg-steel px-4 py-2 text-sm text-radar hover:bg-steel/80"
          >
            View on Etherscan <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-radar" />
            <p className="text-slate-400">Scanning blockchain for your NFTs...</p>
            <p className="text-xs text-slate-500">This may take 30-60 seconds</p>
          </div>
        ) : nfts.length === 0 ? (
          <div className="mt-12 rounded border border-white/10 bg-steel p-12 text-center">
            <p className="text-xl text-slate-400">You don't own any Country NFTs yet</p>
            <p className="mt-2 text-sm text-slate-500">Visit the Marketplace to mint your first country!</p>
            <a
              href="/marketplace"
              className="mt-6 inline-block rounded bg-radar px-6 py-3 font-bold text-obsidian hover:bg-radar/90"
            >
              Go to Marketplace
            </a>
          </div>
        ) : (
          <>
            <div className="mt-2 text-sm text-slate-400">
              Total: {nfts.length} {nfts.length === 1 ? "NFT" : "NFTs"}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {nfts.map((nft) => (
                <article
                  key={nft.tokenId}
                  className="overflow-hidden rounded border border-white/10 bg-steel shadow-tactical"
                >
                  <div className="aspect-square bg-gradient-to-br from-obsidian to-steel p-3">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="p-3">
                    <h2 className="text-lg font-bold text-white">{nft.name}</h2>
                    <p className="text-xs text-slate-400">Token #{nft.tokenId}</p>
                    
                    <div className="mt-3 grid grid-cols-3 gap-1.5 text-xs">
                      {nft.attributes.slice(0, 6).map((attr: any, idx: number) => (
                        <div key={idx} className="rounded bg-obsidian/60 p-1.5">
                          <div className="text-[10px] text-slate-400 truncate">{attr.trait_type}</div>
                          <div className="font-semibold text-radar text-xs truncate">{attr.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex gap-1.5 text-xs">
                      <a
                        href={`https://sepolia.etherscan.io/token/${COUNTRY_NFT_ADDRESS}?a=${nft.tokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded bg-obsidian px-2 py-1.5 text-center text-radar hover:bg-obsidian/80"
                      >
                        Explorer
                      </a>
                      <a
                        href={`/dashboard?country=${nft.tokenId}`}
                        className="flex-1 rounded bg-radar px-2 py-1.5 text-center font-semibold text-obsidian hover:bg-radar/90"
                      >
                        Manage
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
