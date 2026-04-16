// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title BuildingNFT
/// @notice ERC-1155 strategy buildings used to boost NationChain country production and war stats.
contract BuildingNFT is ERC1155, ERC1155Supply, Ownable {
    using Strings for uint256;

    uint256 public constant FACTORY = 1;
    uint256 public constant MINE = 2;
    uint256 public constant BARRACKS = 3;
    uint256 public constant OIL_DERRICK = 4;
    uint256 public constant POWER_PLANT = 5;
    uint256 public constant EMBASSY = 6;
    uint256 public constant MAX_LEVEL = 5;

    address public gameCore;

    struct BuildingBoost {
        uint16 gdpBoost;
        uint16 militaryBoost;
        uint16 govBoost;
        uint16 diplomacyBoost;
        uint16 resourceBoost;
    }

    mapping(uint256 => mapping(uint256 => uint8)) public countryBuildingLevel;

    event GameCoreUpdated(address indexed gameCore);
    event BuildingMinted(address indexed player, uint256 indexed countryId, uint256 indexed buildingType, uint8 level);
    event BuildingDestroyed(address indexed player, uint256 indexed countryId, uint256 indexed buildingType);

    modifier onlyGameCore() {
        require(msg.sender == gameCore, "BuildingNFT: caller is not GameCore");
        _;
    }

    constructor(string memory metadataBaseURI) ERC1155(metadataBaseURI) Ownable(msg.sender) {}

    /// @notice Sets the GameCore contract allowed to mint, upgrade, and destroy buildings.
    function setGameCore(address newGameCore) external onlyOwner {
        require(newGameCore != address(0), "BuildingNFT: game core zero");
        gameCore = newGameCore;
        emit GameCoreUpdated(newGameCore);
    }

    /// @notice Mints or upgrades a building for a country.
    function mintOrUpgrade(address player, uint256 countryId, uint256 buildingType) external onlyGameCore returns (uint8 newLevel) {
        require(_validBuilding(buildingType), "BuildingNFT: invalid type");
        uint8 current = countryBuildingLevel[countryId][buildingType];
        require(current < MAX_LEVEL, "BuildingNFT: max level");
        newLevel = current + 1;
        countryBuildingLevel[countryId][buildingType] = newLevel;
        if (current == 0) _mint(player, buildingType, 1, "");
        emit BuildingMinted(player, countryId, buildingType, newLevel);
    }

    /// @notice Burns one building token and clears the country level.
    function destroyBuilding(address player, uint256 countryId, uint256 buildingType) external onlyGameCore {
        require(countryBuildingLevel[countryId][buildingType] > 0, "BuildingNFT: not built");
        countryBuildingLevel[countryId][buildingType] = 0;
        if (balanceOf(player, buildingType) > 0) _burn(player, buildingType, 1);
        emit BuildingDestroyed(player, countryId, buildingType);
    }

    /// @notice Returns stat boosts for a building type at its current country level.
    function boostFor(uint256 countryId, uint256 buildingType) external view returns (BuildingBoost memory) {
        uint8 level = countryBuildingLevel[countryId][buildingType];
        if (buildingType == FACTORY) return BuildingBoost(level * 8, 0, level * 7, 0, 0);
        if (buildingType == MINE) return BuildingBoost(level * 5, 0, level * 5, 0, level * 10);
        if (buildingType == BARRACKS) return BuildingBoost(0, level * 12, 0, 0, 0);
        if (buildingType == OIL_DERRICK) return BuildingBoost(level * 6, 0, level * 10, 0, level * 15);
        if (buildingType == POWER_PLANT) return BuildingBoost(level * 10, level * 2, level * 6, 0, 0);
        if (buildingType == EMBASSY) return BuildingBoost(level * 3, 0, level * 3, level * 15, 0);
        return BuildingBoost(0, 0, 0, 0, 0);
    }

    /// @notice Returns a concise metadata URI for each building type.
    function uri(uint256 id) public view override returns (string memory) {
        require(_validBuilding(id), "BuildingNFT: invalid type");
        return string.concat(super.uri(id), "/", id.toString(), ".json");
    }

    function _validBuilding(uint256 buildingType) internal pure returns (bool) {
        return buildingType >= FACTORY && buildingType <= EMBASSY;
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }
}
