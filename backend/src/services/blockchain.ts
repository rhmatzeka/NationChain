import { createPublicClient, createWalletClient, http, parseAbi, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { config } from "../config.js";

const gameCoreAbi = parseAbi([
  "function applyNewsEffect(uint256 countryId,string effectType,int256 magnitude)",
  "function updateCommodityMultipliers(uint256 oilMultiplierBps,uint256 goldMultiplierBps)",
  "function initializeCountry(address ownerAddress,uint256 countryId,string name,string isoCode,(uint256 gdp,uint256 population,uint256 militaryPower,uint256 happiness,uint256 oilReserves,uint256 territory) stats)"
]);

const warSystemAbi = parseAbi(["function resolveWar(uint256 battleId,uint256 winnerId)"]);

const transport = config.sepoliaRpcUrl ? http(config.sepoliaRpcUrl) : http();

export const publicClient = createPublicClient({ chain: sepolia, transport });

export function walletClient() {
  if (!config.oraclePrivateKey) return null;
  const account = privateKeyToAccount(config.oraclePrivateKey as `0x${string}`);
  return createWalletClient({ account, chain: sepolia, transport });
}

export async function initializeCountryOnChain(
  ownerAddress: string,
  countryId: number,
  name: string,
  isoCode: string,
  stats: { gdp: number; population: number; militaryPower: number; happiness: number; oilReserves: number; territory: number }
) {
  if (!config.gameCoreAddress) return { skipped: true, reason: "GAME_CORE_ADDRESS not configured" };
  const client = walletClient();
  if (!client) return { skipped: true, reason: "ORACLE_PRIVATE_KEY not configured" };
  
  const hash = await client.writeContract({
    address: config.gameCoreAddress as Address,
    abi: gameCoreAbi,
    functionName: "initializeCountry",
    args: [
      ownerAddress as Address,
      BigInt(countryId),
      name,
      isoCode,
      {
        gdp: BigInt(stats.gdp),
        population: BigInt(stats.population),
        militaryPower: BigInt(stats.militaryPower),
        happiness: BigInt(stats.happiness),
        oilReserves: BigInt(stats.oilReserves),
        territory: BigInt(stats.territory)
      }
    ]
  });
  
  await publicClient.waitForTransactionReceipt({ hash });
  return { skipped: false, hash };
}

export async function applyNewsEffectOnChain(countryId: number, stat: string, deltaBps: number) {
  if (!config.gameCoreAddress) return { skipped: true, reason: "GAME_CORE_ADDRESS not configured" };
  const client = walletClient();
  if (!client) return { skipped: true, reason: "ORACLE_PRIVATE_KEY not configured" };
  const hash = await client.writeContract({
    address: config.gameCoreAddress as Address,
    abi: gameCoreAbi,
    functionName: "applyNewsEffect",
    args: [BigInt(countryId), stat, BigInt(deltaBps)]
  });
  return { skipped: false, hash };
}

export async function updateCommodityMultipliersOnChain(oilBps: number, goldBps: number) {
  if (!config.gameCoreAddress) return { skipped: true, reason: "GAME_CORE_ADDRESS not configured" };
  const client = walletClient();
  if (!client) return { skipped: true, reason: "ORACLE_PRIVATE_KEY not configured" };
  const hash = await client.writeContract({
    address: config.gameCoreAddress as Address,
    abi: gameCoreAbi,
    functionName: "updateCommodityMultipliers",
    args: [BigInt(oilBps), BigInt(goldBps)]
  });
  return { skipped: false, hash };
}

export async function resolveWarOnChain(battleId: number, winnerId: number) {
  if (!config.warSystemAddress) return { skipped: true, reason: "WAR_SYSTEM_ADDRESS not configured" };
  const client = walletClient();
  if (!client) return { skipped: true, reason: "ORACLE_PRIVATE_KEY not configured" };
  const hash = await client.writeContract({
    address: config.warSystemAddress as Address,
    abi: warSystemAbi,
    functionName: "resolveWar",
    args: [BigInt(battleId), BigInt(winnerId)]
  });
  return { skipped: false, hash };
}
