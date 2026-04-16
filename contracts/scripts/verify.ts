import { run, network } from "hardhat";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const deploymentPath = path.join(process.cwd(), "deployments", `${network.name}.json`);
  if (!fs.existsSync(deploymentPath)) throw new Error(`Missing deployment file: ${deploymentPath}`);
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const treasury = deployment.treasury;
  const backendOracle = deployment.backendOracle;
  const baseUri = process.env.BUILDING_METADATA_BASE_URI || "https://nationchain.game/metadata/buildings";

  const targets: Array<[string, unknown[]]> = [
    [deployment.NationToken, [treasury]],
    [deployment.GovToken, [treasury]],
    [deployment.CountryNFT, []],
    [deployment.BuildingNFT, [baseUri]],
    [deployment.MockVRF, []],
    [deployment.GameCore, [deployment.GovToken, deployment.CountryNFT, deployment.BuildingNFT, backendOracle]],
    [deployment.WarSystem, [deployment.NationToken, deployment.GovToken, deployment.CountryNFT, deployment.BuildingNFT, deployment.MockVRF, backendOracle]],
    [deployment.DiplomacySystem, [deployment.CountryNFT, deployment.NationToken]],
    [deployment.Marketplace, [treasury]]
  ];

  for (const [address, constructorArguments] of targets) {
    try {
      await run("verify:verify", { address, constructorArguments });
      console.log(`Verified ${address}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.toLowerCase().includes("already verified")) console.log(`Already verified ${address}`);
      else throw error;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
