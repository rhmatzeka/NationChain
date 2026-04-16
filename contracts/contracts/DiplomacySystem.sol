// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {CountryNFT} from "./CountryNFT.sol";
import {NationToken} from "./NationToken.sol";

/// @title DiplomacySystem
/// @notice Alliances, trade proposals, UN-style voting, and temporary sanctions for NationChain.
contract DiplomacySystem is Ownable, ReentrancyGuard {
    enum ProposalStatus {
        Pending,
        Accepted,
        Rejected,
        Cancelled
    }

    struct Alliance {
        uint256 id;
        string name;
        uint256[] countryIds;
        uint16 treasuryShareBps;
        address treasuryAddress;
        uint64 createdAt;
        bool active;
    }

    struct TradeProposal {
        uint256 id;
        uint256 fromCountry;
        uint256 toCountry;
        string resourceType;
        uint256 amount;
        uint256 govPrice;
        ProposalStatus status;
        uint64 createdAt;
    }

    struct Resolution {
        uint256 id;
        uint256 targetCountry;
        string metadataURI;
        uint64 endAt;
        uint256 supportPower;
        uint256 opposePower;
        bool executed;
    }

    CountryNFT public immutable countryNFT;
    NationToken public immutable nationToken;
    uint256 public nextAllianceId = 1;
    uint256 public nextTradeId = 1;
    uint256 public nextResolutionId = 1;

    mapping(uint256 => Alliance) public alliances;
    mapping(uint256 => TradeProposal) public tradeProposals;
    mapping(uint256 => Resolution) public resolutions;
    mapping(uint256 => mapping(address => bool)) public resolutionVoted;
    mapping(uint256 => uint64) public sanctionedUntil;

    event AllianceCreated(uint256 indexed allianceId, string name, uint256[] countryIds, uint16 treasuryShareBps, address treasuryAddress);
    event TradeProposed(uint256 indexed proposalId, uint256 indexed fromCountry, uint256 indexed toCountry, string resourceType, uint256 amount, uint256 govPrice);
    event TradeStatusUpdated(uint256 indexed proposalId, ProposalStatus status);
    event ResolutionCreated(uint256 indexed resolutionId, uint256 indexed targetCountry, uint64 endAt, string metadataURI);
    event ResolutionVoted(uint256 indexed resolutionId, address indexed voter, bool support, uint256 votingPower);
    event ResolutionExecuted(uint256 indexed resolutionId, bool passed);
    event SanctionImposed(uint256 indexed sourceCountry, uint256 indexed targetCountry, uint64 until);

    constructor(CountryNFT _countryNFT, NationToken _nationToken) Ownable(msg.sender) {
        countryNFT = _countryNFT;
        nationToken = _nationToken;
    }

    /// @notice Creates an alliance controlled off-chain by a multi-sig treasury address.
    function createAlliance(string calldata name, uint256[] calldata countryIds, uint16 treasuryShareBps, address treasuryAddress) external nonReentrant returns (uint256 allianceId) {
        require(bytes(name).length > 0, "DiplomacySystem: empty name");
        require(countryIds.length >= 2, "DiplomacySystem: need members");
        require(treasuryShareBps <= 5_000, "DiplomacySystem: share too high");
        require(treasuryAddress != address(0), "DiplomacySystem: treasury zero");
        bool callerOwnsMember = false;
        for (uint256 i = 0; i < countryIds.length; i++) {
            if (countryNFT.ownerOf(countryIds[i]) == msg.sender) callerOwnsMember = true;
        }
        require(callerOwnsMember, "DiplomacySystem: caller not member");
        allianceId = nextAllianceId++;
        alliances[allianceId] = Alliance(allianceId, name, countryIds, treasuryShareBps, treasuryAddress, uint64(block.timestamp), true);
        emit AllianceCreated(allianceId, name, countryIds, treasuryShareBps, treasuryAddress);
    }

    /// @notice Proposes a direct resource trade priced in GOV.
    function proposeTrade(uint256 fromCountry, uint256 toCountry, string calldata resourceType, uint256 amount, uint256 govPrice) external returns (uint256 proposalId) {
        require(countryNFT.ownerOf(fromCountry) == msg.sender, "DiplomacySystem: not source owner");
        require(fromCountry != toCountry, "DiplomacySystem: same country");
        require(amount > 0 && govPrice > 0, "DiplomacySystem: bad terms");
        proposalId = nextTradeId++;
        tradeProposals[proposalId] = TradeProposal(proposalId, fromCountry, toCountry, resourceType, amount, govPrice, ProposalStatus.Pending, uint64(block.timestamp));
        emit TradeProposed(proposalId, fromCountry, toCountry, resourceType, amount, govPrice);
    }

    /// @notice Accepts or rejects a pending trade proposal.
    function respondTrade(uint256 proposalId, bool accept) external {
        TradeProposal storage proposal = tradeProposals[proposalId];
        require(proposal.status == ProposalStatus.Pending, "DiplomacySystem: closed");
        require(countryNFT.ownerOf(proposal.toCountry) == msg.sender, "DiplomacySystem: not target owner");
        proposal.status = accept ? ProposalStatus.Accepted : ProposalStatus.Rejected;
        emit TradeStatusUpdated(proposalId, proposal.status);
    }

    /// @notice Creates a vote where staked NATION governance power determines the result.
    function createUNResolution(uint256 targetCountry, string calldata metadataURI, uint64 votingPeriod) external returns (uint256 resolutionId) {
        require(countryNFT.ownerOf(targetCountry) != address(0), "DiplomacySystem: missing target");
        require(votingPeriod >= 1 hours && votingPeriod <= 7 days, "DiplomacySystem: invalid period");
        resolutionId = nextResolutionId++;
        resolutions[resolutionId] = Resolution(resolutionId, targetCountry, metadataURI, uint64(block.timestamp) + votingPeriod, 0, 0, false);
        emit ResolutionCreated(resolutionId, targetCountry, uint64(block.timestamp) + votingPeriod, metadataURI);
    }

    /// @notice Casts a UN vote using current NATION staking power.
    function UN_vote(uint256 resolutionId, bool support) external {
        Resolution storage resolution = resolutions[resolutionId];
        require(block.timestamp < resolution.endAt, "DiplomacySystem: vote ended");
        require(!resolutionVoted[resolutionId][msg.sender], "DiplomacySystem: already voted");
        uint256 power = nationToken.governancePower(msg.sender);
        require(power > 0, "DiplomacySystem: no voting power");
        resolutionVoted[resolutionId][msg.sender] = true;
        if (support) resolution.supportPower += power;
        else resolution.opposePower += power;
        emit ResolutionVoted(resolutionId, msg.sender, support, power);
    }

    /// @notice Executes a completed UN resolution and records whether it passed.
    function executeResolution(uint256 resolutionId) external {
        Resolution storage resolution = resolutions[resolutionId];
        require(block.timestamp >= resolution.endAt, "DiplomacySystem: still voting");
        require(!resolution.executed, "DiplomacySystem: executed");
        resolution.executed = true;
        emit ResolutionExecuted(resolutionId, resolution.supportPower > resolution.opposePower);
    }

    /// @notice Imposes a 48-hour sanction against another country.
    function imposeSanction(uint256 sourceCountry, uint256 targetCountry) external {
        require(countryNFT.ownerOf(sourceCountry) == msg.sender, "DiplomacySystem: not source owner");
        require(sourceCountry != targetCountry, "DiplomacySystem: same country");
        uint64 until = uint64(block.timestamp + 48 hours);
        sanctionedUntil[targetCountry] = until;
        emit SanctionImposed(sourceCountry, targetCountry, until);
    }
}
