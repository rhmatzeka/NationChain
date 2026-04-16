import { ethers, run, network } from "hardhat";
import fs from "node:fs";
import path from "node:path";

type Deployment = Record<string, string>;

async function verify(address: string, constructorArguments: unknown[]) {
  if (network.name === "hardhat" || network.name === "localhost" || !process.env.ETHERSCAN_API_KEY) return;
  try {
    await run("verify:verify", { address, constructorArguments });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.toLowerCase().includes("already verified")) throw error;
  }
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const treasury = process.env.TREASURY_ADDRESS || deployer.address;
  const backendOracle = process.env.BACKEND_ORACLE_ADDRESS || deployer.address;
  const baseUri = process.env.BUILDING_METADATA_BASE_URI || "https://nationchain.game/metadata/buildings";

  const NationToken = await ethers.getContractFactory("NationToken");
  const nationToken = await NationToken.deploy(treasury);
  await nationToken.waitForDeployment();

  const GovToken = await ethers.getContractFactory("GovToken");
  const govToken = await GovToken.deploy(treasury);
  await govToken.waitForDeployment();

  const CountryNFT = await ethers.getContractFactory("CountryNFT");
  const countryNFT = await CountryNFT.deploy();
  await countryNFT.waitForDeployment();

  const BuildingNFT = await ethers.getContractFactory("BuildingNFT");
  const buildingNFT = await BuildingNFT.deploy(baseUri);
  await buildingNFT.waitForDeployment();

  const MockVRF = await ethers.getContractFactory("MockVRF");
  const mockVRF = await MockVRF.deploy();
  await mockVRF.waitForDeployment();

  const GameCore = await ethers.getContractFactory("GameCore");
  const gameCore = await GameCore.deploy(
    await govToken.getAddress(),
    await countryNFT.getAddress(),
    await buildingNFT.getAddress(),
    backendOracle
  );
  await gameCore.waitForDeployment();

  const WarSystem = await ethers.getContractFactory("WarSystem");
  const warSystem = await WarSystem.deploy(
    await nationToken.getAddress(),
    await govToken.getAddress(),
    await countryNFT.getAddress(),
    await buildingNFT.getAddress(),
    await mockVRF.getAddress(),
    backendOracle
  );
  await warSystem.waitForDeployment();

  const DiplomacySystem = await ethers.getContractFactory("DiplomacySystem");
  const diplomacySystem = await DiplomacySystem.deploy(await countryNFT.getAddress(), await nationToken.getAddress());
  await diplomacySystem.waitForDeployment();

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(treasury);
  await marketplace.waitForDeployment();

  await (await govToken.setGameCore(await gameCore.getAddress())).wait();
  await (await countryNFT.setGameCore(await gameCore.getAddress())).wait();
  await (await buildingNFT.setGameCore(await gameCore.getAddress())).wait();
  await (await nationToken.setWarSystem(await warSystem.getAddress())).wait();

  const deployment: Deployment = {
    network: network.name,
    deployer: deployer.address,
    treasury,
    backendOracle,
    NationToken: await nationToken.getAddress(),
    GovToken: await govToken.getAddress(),
    CountryNFT: await countryNFT.getAddress(),
    BuildingNFT: await buildingNFT.getAddress(),
    MockVRF: await mockVRF.getAddress(),
    GameCore: await gameCore.getAddress(),
    WarSystem: await warSystem.getAddress(),
    DiplomacySystem: await diplomacySystem.getAddress(),
    Marketplace: await marketplace.getAddress()
  };

  const outDir = path.join(process.cwd(), "deployments");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${network.name}.json`), JSON.stringify(deployment, null, 2));

  await verify(deployment.NationToken, [treasury]);
  await verify(deployment.GovToken, [treasury]);
  await verify(deployment.CountryNFT, []);
  await verify(deployment.BuildingNFT, [baseUri]);
  await verify(deployment.MockVRF, []);
  await verify(deployment.GameCore, [deployment.GovToken, deployment.CountryNFT, deployment.BuildingNFT, backendOracle]);
  await verify(deployment.WarSystem, [deployment.NationToken, deployment.GovToken, deployment.CountryNFT, deployment.BuildingNFT, deployment.MockVRF, backendOracle]);
  await verify(deployment.DiplomacySystem, [deployment.CountryNFT, deployment.NationToken]);
  await verify(deployment.Marketplace, [treasury]);

  console.log(JSON.stringify(deployment, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
