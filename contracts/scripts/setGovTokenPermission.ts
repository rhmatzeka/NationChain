import { ethers } from "hardhat";

async function main() {
  console.log("Setting GameCore permission for GovToken...");

  const govTokenAddress = "0x077Ff1092d66c59F4e0F7033318841CF714E7940";
  const gameCoreAddress = "0x0e313B28f5D15Dbc96E149BBA4FdBD408fa13D5A";

  const govToken = await ethers.getContractAt("GovToken", govTokenAddress);

  console.log("Current GameCore:", await govToken.gameCore());

  const tx = await govToken.setGameCore(gameCoreAddress);
  console.log("Transaction sent:", tx.hash);

  await tx.wait();
  console.log("✅ GameCore permission set successfully!");

  console.log("New GameCore:", await govToken.gameCore());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
