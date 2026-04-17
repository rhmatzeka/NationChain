import { ethers } from "hardhat";

async function main() {
  console.log("Setting Backend Oracle as GameCore for GovToken...");

  const govTokenAddress = "0x077Ff1092d66c59F4e0F7033318841CF714E7940";
  const backendOracleAddress = "0xc0C71F52149C26D7718a6C257aAb185908dB79a8"; // From deployer wallet

  const govToken = await ethers.getContractAt("GovToken", govTokenAddress);

  console.log("Current GameCore:", await govToken.gameCore());
  console.log("Setting to Backend Oracle:", backendOracleAddress);

  const tx = await govToken.setGameCore(backendOracleAddress);
  console.log("Transaction sent:", tx.hash);

  await tx.wait();
  console.log("✅ Backend Oracle set as GameCore successfully!");

  console.log("New GameCore:", await govToken.gameCore());
  console.log("\nNow backend can mint GOV tokens directly!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
