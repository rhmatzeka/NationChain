import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL || "",
  sepoliaRpcUrl: process.env.SEPOLIA_RPC_URL || "",
  oraclePrivateKey: process.env.ORACLE_PRIVATE_KEY || "",
  gameCoreAddress: process.env.GAME_CORE_ADDRESS || "",
  warSystemAddress: process.env.WAR_SYSTEM_ADDRESS || "",
  countryNFTAddress: process.env.COUNTRY_NFT_ADDRESS || "",
  newsApiKey: process.env.NEWSAPI_KEY || "",
  gnewsApiKey: process.env.GNEWS_API_KEY || "",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  alphaVantageKey: process.env.ALPHA_VANTAGE_API_KEY || "",
  nodeEnv: process.env.NODE_ENV || "development"
};
