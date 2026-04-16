// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {GovToken} from "./GovToken.sol";
import {CountryNFT} from "./CountryNFT.sol";
import {BuildingNFT} from "./BuildingNFT.sol";

/// @title GameCore
/// @notice Central state coordinator for NationChain production, construction, minting, and news effects.
contract GameCore is Ownable, ReentrancyGuard {
    GovToken public immutable govToken;
    CountryNFT public immutable countryNFT;
    BuildingNFT public immutable buildingNFT;

    address public backendOracle;
    uint256 public commodityOilMultiplierBps = 10_000;
    uint256 public commodityGoldMultiplierBps = 10_000;

    struct FullCountryState {
        uint256 countryId;
        address owner;
        CountryNFT.CountryStats stats;
        uint8[6] buildingLevels;
        uint256 dailyGovIncome;
        uint256 nextClaimAt;
    }

    mapping(uint256 => uint256) public lastClaimAt;
    mapping(uint256 => bool) public countryInitialized;

    event BackendOracleUpdated(address indexed backendOracle);
    event CountryInitialized(uint256 indexed countryId, address indexed owner, string name, string isoCode);
    event DailyClaimed(uint256 indexed countryId, address indexed owner, uint256 amount);
    event NewsEffectApplied(uint256 indexed countryId, string effectType, int256 magnitude, CountryNFT.CountryStats updatedStats);
    event StructureBuilt(uint256 indexed countryId, address indexed owner, uint256 indexed buildingType, uint8 level, uint256 govCost);
    event CommodityMultipliersUpdated(uint256 oilMultiplierBps, uint256 goldMultiplierBps);

    modifier onlyOracle() {
        require(msg.sender == backendOracle || msg.sender == owner(), "GameCore: caller is not oracle");
        _;
    }

    constructor(GovToken _govToken, CountryNFT _countryNFT, BuildingNFT _buildingNFT, address _backendOracle) Ownable(msg.sender) {
        require(address(_govToken) != address(0), "GameCore: gov zero");
        require(address(_countryNFT) != address(0), "GameCore: country zero");
        require(address(_buildingNFT) != address(0), "GameCore: building zero");
        govToken = _govToken;
        countryNFT = _countryNFT;
        buildingNFT = _buildingNFT;
        backendOracle = _backendOracle == address(0) ? msg.sender : _backendOracle;
    }

    /// @notice Updates the trusted backend oracle wallet.
    function setBackendOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "GameCore: oracle zero");
        backendOracle = newOracle;
        emit BackendOracleUpdated(newOracle);
    }

    /// @notice Mints an unclaimed country NFT with initial attributes.
    function initializeCountry(address ownerAddress, uint256 countryId, string calldata name, string calldata isoCode, CountryNFT.CountryStats calldata stats) external onlyOracle {
        require(!countryInitialized[countryId], "GameCore: already initialized");
        countryInitialized[countryId] = true;
        countryNFT.mintCountry(ownerAddress, countryId, name, isoCode, stats);
        emit CountryInitialized(countryId, ownerAddress, name, isoCode);
    }

    /// @notice Claims daily GOV production for the owner of a country NFT.
    function dailyClaim(uint256 countryId) external nonReentrant {
        require(countryNFT.ownerOf(countryId) == msg.sender, "GameCore: not country owner");
        require(block.timestamp >= lastClaimAt[countryId] + 1 days, "GameCore: claim on cooldown");
        uint256 amount = calculateDailyGov(countryId);
        lastClaimAt[countryId] = block.timestamp;
        govToken.mint(msg.sender, amount);
        emit DailyClaimed(countryId, msg.sender, amount);
    }

    /// @notice Applies a real-world news effect from the backend oracle.
    /// @param effectType One of gdp, military, happiness, oil, population, territory, trade_income, crisis_mode.
    /// @param magnitude Signed basis-point delta where 1000 is 10%.
    function applyNewsEffect(uint256 countryId, string calldata effectType, int256 magnitude) external onlyOracle {
        CountryNFT.CountryStats memory stats = countryNFT.statsOf(countryId);
        bytes32 effect = keccak256(bytes(effectType));
        if (effect == keccak256("gdp") || effect == keccak256("trade_income") || effect == keccak256("crisis_mode")) {
            stats.gdp = _applySignedBps(stats.gdp, magnitude);
        } else if (effect == keccak256("military") || effect == keccak256("military_morale") || effect == keccak256("military_tension")) {
            stats.militaryPower = _applySignedBps(stats.militaryPower, magnitude);
        } else if (effect == keccak256("happiness") || effect == keccak256("refugee_event")) {
            stats.happiness = _cap100(_applySignedBps(stats.happiness, magnitude));
        } else if (effect == keccak256("oil") || effect == keccak256("oil_reserves")) {
            stats.oilReserves = _applySignedBps(stats.oilReserves, magnitude);
        } else if (effect == keccak256("population")) {
            stats.population = _applySignedBps(stats.population, magnitude);
        } else if (effect == keccak256("territory")) {
            stats.territory = _applySignedBps(stats.territory, magnitude);
        } else {
            revert("GameCore: unsupported effect");
        }
        countryNFT.updateStats(countryId, stats);
        emit NewsEffectApplied(countryId, effectType, magnitude, stats);
    }

    /// @notice Builds or upgrades a country structure by burning GOV and minting BuildingNFT.
    function buildStructure(uint256 countryId, uint256 buildingType) external nonReentrant {
        require(countryNFT.ownerOf(countryId) == msg.sender, "GameCore: not country owner");
        uint8 currentLevel = buildingNFT.countryBuildingLevel(countryId, buildingType);
        require(currentLevel < buildingNFT.MAX_LEVEL(), "GameCore: max level");
        uint256 cost = buildCost(buildingType, currentLevel + 1);
        govToken.burnFromGame(msg.sender, cost);
        uint8 newLevel = buildingNFT.mintOrUpgrade(msg.sender, countryId, buildingType);
        CountryNFT.CountryStats memory stats = countryNFT.statsOf(countryId);
        if (buildingType == buildingNFT.BARRACKS()) stats.militaryPower += 250 * newLevel;
        else if (buildingType == buildingNFT.EMBASSY()) stats.happiness = _cap100(stats.happiness + 2 * newLevel);
        else stats.gdp += 400 * newLevel;
        countryNFT.updateStats(countryId, stats);
        emit StructureBuilt(countryId, msg.sender, buildingType, newLevel, cost);
    }

    /// @notice Updates real-world commodity multipliers used by GOV production.
    function updateCommodityMultipliers(uint256 oilMultiplierBps, uint256 goldMultiplierBps) external onlyOracle {
        require(oilMultiplierBps >= 5_000 && oilMultiplierBps <= 25_000, "GameCore: bad oil bps");
        require(goldMultiplierBps >= 5_000 && goldMultiplierBps <= 25_000, "GameCore: bad gold bps");
        commodityOilMultiplierBps = oilMultiplierBps;
        commodityGoldMultiplierBps = goldMultiplierBps;
        emit CommodityMultipliersUpdated(oilMultiplierBps, goldMultiplierBps);
    }

    /// @notice Returns all on-chain country data needed by the frontend.
    function getCountryFullState(uint256 countryId) external view returns (FullCountryState memory state) {
        uint8[6] memory levels;
        for (uint256 i = 1; i <= 6; i++) levels[i - 1] = buildingNFT.countryBuildingLevel(countryId, i);
        return FullCountryState({
            countryId: countryId,
            owner: countryNFT.ownerOf(countryId),
            stats: countryNFT.statsOf(countryId),
            buildingLevels: levels,
            dailyGovIncome: calculateDailyGov(countryId),
            nextClaimAt: lastClaimAt[countryId] + 1 days
        });
    }

    /// @notice Computes GOV income from GDP, happiness, resources, and buildings.
    function calculateDailyGov(uint256 countryId) public view returns (uint256) {
        CountryNFT.CountryStats memory stats = countryNFT.statsOf(countryId);
        uint256 baseIncome = (stats.gdp / 100) + (stats.population / 5_000_000) + (stats.happiness * 2);
        uint256 buildingBoostBps = 10_000;
        for (uint256 i = 1; i <= 6; i++) buildingBoostBps += uint256(buildingNFT.countryBuildingLevel(countryId, i)) * 500;
        uint256 oilBoost = (stats.oilReserves * commodityOilMultiplierBps) / 1_000_000;
        uint256 amount = ((baseIncome + oilBoost) * buildingBoostBps) / 10_000;
        return amount < 50 ? 50 ether : amount * 1 ether;
    }

    /// @notice Returns build cost in GOV for a building type and target level.
    function buildCost(uint256 buildingType, uint256 targetLevel) public pure returns (uint256) {
        require(buildingType >= 1 && buildingType <= 6, "GameCore: invalid building");
        require(targetLevel >= 1 && targetLevel <= 5, "GameCore: invalid level");
        uint256 base = buildingType == 3 ? 350 ether : buildingType == 6 ? 300 ether : 250 ether;
        return base * targetLevel * targetLevel;
    }

    function _applySignedBps(uint256 value, int256 deltaBps) private pure returns (uint256) {
        if (deltaBps >= 0) return value + ((value * uint256(deltaBps)) / 10_000);
        uint256 reduction = (value * uint256(-deltaBps)) / 10_000;
        return reduction >= value ? 0 : value - reduction;
    }

    function _cap100(uint256 value) private pure returns (uint256) {
        return value > 100 ? 100 : value;
    }
}
