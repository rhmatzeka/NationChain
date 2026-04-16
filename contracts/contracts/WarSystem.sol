// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {NationToken} from "./NationToken.sol";
import {GovToken} from "./GovToken.sol";
import {CountryNFT} from "./CountryNFT.sol";
import {BuildingNFT} from "./BuildingNFT.sol";
import {MockVRF} from "./MockVRF.sol";

/// @title WarSystem
/// @notice Real-time PvP war bonds, ceasefires, oracle resolution, and randomized building loot.
contract WarSystem is Ownable, ReentrancyGuard {
    enum BattleStatus {
        Active,
        Ceasefire,
        Resolved
    }

    struct Battle {
        uint256 id;
        uint256 attackerId;
        uint256 defenderId;
        address attacker;
        address defender;
        uint256 attackerStake;
        uint256 defenderStake;
        uint64 startedAt;
        uint64 resolveAfter;
        uint256 vrfRequestId;
        BattleStatus status;
        uint256 winnerId;
    }

    NationToken public immutable nationToken;
    GovToken public immutable govToken;
    CountryNFT public immutable countryNFT;
    BuildingNFT public immutable buildingNFT;
    MockVRF public immutable vrf;
    address public battleOracle;
    uint256 public nextBattleId = 1;
    uint256 public constant MIN_WAR_BOND = 100 ether;

    mapping(uint256 => Battle) public battles;
    mapping(uint256 => bool) public activeWarByCountry;
    mapping(uint256 => mapping(address => bool)) public ceasefireSigned;

    event BattleDeclared(uint256 indexed battleId, uint256 indexed attackerId, uint256 indexed defenderId, uint256 stake, uint256 resolveAfter);
    event DefenderBondPosted(uint256 indexed battleId, address indexed defender, uint256 amount);
    event BattleResolved(uint256 indexed battleId, uint256 indexed winnerId, uint256 lootBuildingType, uint256 randomWord);
    event CeasefireSigned(uint256 indexed battleId, address indexed signer);
    event CeasefireExecuted(uint256 indexed battleId);
    event DefenseBoostPurchased(uint256 indexed battleId, uint256 indexed countryId, uint256 govSpent);
    event BattleOracleUpdated(address indexed oracle);

    modifier onlyOracle() {
        require(msg.sender == battleOracle || msg.sender == owner(), "WarSystem: caller is not oracle");
        _;
    }

    constructor(
        NationToken _nationToken,
        GovToken _govToken,
        CountryNFT _countryNFT,
        BuildingNFT _buildingNFT,
        MockVRF _vrf,
        address _battleOracle
    ) Ownable(msg.sender) {
        nationToken = _nationToken;
        govToken = _govToken;
        countryNFT = _countryNFT;
        buildingNFT = _buildingNFT;
        vrf = _vrf;
        battleOracle = _battleOracle == address(0) ? msg.sender : _battleOracle;
    }

    /// @notice Sets the trusted battle oracle.
    function setBattleOracle(address oracle) external onlyOwner {
        require(oracle != address(0), "WarSystem: oracle zero");
        battleOracle = oracle;
        emit BattleOracleUpdated(oracle);
    }

    /// @notice Declares war and escrows the attacker's NATION war bond.
    function declareWar(uint256 attackerId, uint256 defenderId, uint256 stakeAmount) external nonReentrant returns (uint256 battleId) {
        require(attackerId != defenderId, "WarSystem: same country");
        require(countryNFT.ownerOf(attackerId) == msg.sender, "WarSystem: not attacker owner");
        require(!activeWarByCountry[attackerId] && !activeWarByCountry[defenderId], "WarSystem: country already at war");
        require(stakeAmount >= MIN_WAR_BOND, "WarSystem: bond too low");
        address defender = countryNFT.ownerOf(defenderId);
        nationToken.transferFrom(msg.sender, address(this), stakeAmount);
        uint256 requestId = vrf.requestRandomness();
        battleId = nextBattleId++;
        battles[battleId] = Battle({
            id: battleId,
            attackerId: attackerId,
            defenderId: defenderId,
            attacker: msg.sender,
            defender: defender,
            attackerStake: stakeAmount,
            defenderStake: 0,
            startedAt: uint64(block.timestamp),
            resolveAfter: uint64(block.timestamp + 1 hours),
            vrfRequestId: requestId,
            status: BattleStatus.Active,
            winnerId: 0
        });
        activeWarByCountry[attackerId] = true;
        activeWarByCountry[defenderId] = true;
        emit BattleDeclared(battleId, attackerId, defenderId, stakeAmount, block.timestamp + 1 hours);
    }

    /// @notice Lets the defender post a matching or larger war bond.
    function postDefenderBond(uint256 battleId, uint256 amount) external nonReentrant {
        Battle storage battle = battles[battleId];
        require(battle.status == BattleStatus.Active, "WarSystem: battle inactive");
        require(msg.sender == battle.defender, "WarSystem: not defender");
        require(amount >= MIN_WAR_BOND, "WarSystem: bond too low");
        nationToken.transferFrom(msg.sender, address(this), amount);
        battle.defenderStake += amount;
        emit DefenderBondPosted(battleId, msg.sender, amount);
    }

    /// @notice Pays GOV for a mid-battle defensive strength boost broadcast by the backend.
    function buyDefenseBoost(uint256 battleId, uint256 countryId, uint256 govAmount) external nonReentrant {
        Battle memory battle = battles[battleId];
        require(battle.status == BattleStatus.Active, "WarSystem: battle inactive");
        require(countryId == battle.attackerId || countryId == battle.defenderId, "WarSystem: country not in battle");
        require(countryNFT.ownerOf(countryId) == msg.sender, "WarSystem: not country owner");
        require(govAmount >= 50 ether, "WarSystem: boost too small");
        govToken.transferFrom(msg.sender, address(this), govAmount);
        govToken.burn(govAmount);
        emit DefenseBoostPurchased(battleId, countryId, govAmount);
    }

    /// @notice Resolves a battle after the one-hour timer. The backend oracle supplies the winner from battle simulation.
    function resolveWar(uint256 battleId, uint256 winnerId) external onlyOracle nonReentrant {
        Battle storage battle = battles[battleId];
        require(battle.status == BattleStatus.Active, "WarSystem: battle inactive");
        require(block.timestamp >= battle.resolveAfter, "WarSystem: timer active");
        require(winnerId == battle.attackerId || winnerId == battle.defenderId, "WarSystem: invalid winner");
        uint256 randomWord = vrf.consumeRandomness(battle.vrfRequestId);
        battle.status = BattleStatus.Resolved;
        battle.winnerId = winnerId;
        activeWarByCountry[battle.attackerId] = false;
        activeWarByCountry[battle.defenderId] = false;

        address winner = winnerId == battle.attackerId ? battle.attacker : battle.defender;
        address loser = winnerId == battle.attackerId ? battle.defender : battle.attacker;
        uint256 winnerStake = winnerId == battle.attackerId ? battle.attackerStake : battle.defenderStake;
        uint256 loserStake = winnerId == battle.attackerId ? battle.defenderStake : battle.attackerStake;
        if (winnerStake > 0) nationToken.transfer(winner, winnerStake);
        if (loserStake > 0) nationToken.transfer(winner, loserStake);
        nationToken.burnFromWar(loser, 25 ether);

        uint256 loserCountry = winnerId == battle.attackerId ? battle.defenderId : battle.attackerId;
        uint256 lootType = (randomWord % 6) + 1;
        if (buildingNFT.countryBuildingLevel(loserCountry, lootType) > 0) {
            buildingNFT.destroyBuilding(loser, loserCountry, lootType);
            buildingNFT.mintOrUpgrade(winner, winnerId, lootType);
        }
        emit BattleResolved(battleId, winnerId, lootType, randomWord);
    }

    /// @notice Signs a ceasefire. Once both sides sign, stakes are refunded and the battle ends.
    function signCeasefire(uint256 battleId) external nonReentrant {
        Battle storage battle = battles[battleId];
        require(battle.status == BattleStatus.Active, "WarSystem: battle inactive");
        require(msg.sender == battle.attacker || msg.sender == battle.defender, "WarSystem: not participant");
        ceasefireSigned[battleId][msg.sender] = true;
        emit CeasefireSigned(battleId, msg.sender);
        if (ceasefireSigned[battleId][battle.attacker] && ceasefireSigned[battleId][battle.defender]) {
            battle.status = BattleStatus.Ceasefire;
            activeWarByCountry[battle.attackerId] = false;
            activeWarByCountry[battle.defenderId] = false;
            if (battle.attackerStake > 0) nationToken.transfer(battle.attacker, battle.attackerStake);
            if (battle.defenderStake > 0) nationToken.transfer(battle.defender, battle.defenderStake);
            emit CeasefireExecuted(battleId);
        }
    }
}
