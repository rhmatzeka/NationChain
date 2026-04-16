export const contracts = {
  nationToken: process.env.NEXT_PUBLIC_NATION_TOKEN_ADDRESS as `0x${string}` | undefined,
  govToken: process.env.NEXT_PUBLIC_GOV_TOKEN_ADDRESS as `0x${string}` | undefined,
  countryNFT: process.env.NEXT_PUBLIC_COUNTRY_NFT_ADDRESS as `0x${string}` | undefined,
  buildingNFT: process.env.NEXT_PUBLIC_BUILDING_NFT_ADDRESS as `0x${string}` | undefined,
  gameCore: process.env.NEXT_PUBLIC_GAME_CORE_ADDRESS as `0x${string}` | undefined,
  warSystem: process.env.NEXT_PUBLIC_WAR_SYSTEM_ADDRESS as `0x${string}` | undefined,
  diplomacySystem: process.env.NEXT_PUBLIC_DIPLOMACY_SYSTEM_ADDRESS as `0x${string}` | undefined,
  marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}` | undefined
};

export const erc20Abi = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] }
] as const;

export const gameCoreAbi = [
  { type: "function", name: "dailyClaim", stateMutability: "nonpayable", inputs: [{ name: "countryId", type: "uint256" }], outputs: [] },
  { type: "function", name: "buildStructure", stateMutability: "nonpayable", inputs: [{ name: "countryId", type: "uint256" }, { name: "buildingType", type: "uint256" }], outputs: [] }
] as const;

export const warSystemAbi = [
  { type: "function", name: "declareWar", stateMutability: "nonpayable", inputs: [{ name: "attackerId", type: "uint256" }, { name: "defenderId", type: "uint256" }, { name: "stakeAmount", type: "uint256" }], outputs: [{ type: "uint256" }] }
] as const;
