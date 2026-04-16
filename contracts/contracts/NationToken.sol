// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title NationToken
/// @notice Fixed-supply governance and reward token for NationChain.
/// @dev Includes time-locked staking, linear vesting, and an authorized war burn hook.
contract NationToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 100_000_000 ether;
    uint256 public constant MIN_STAKE_LOCK = 1 days;
    uint256 public constant MAX_STAKE_LOCK = 730 days;

    address public warSystem;

    struct StakePosition {
        uint256 amount;
        uint64 unlockAt;
    }

    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint64 start;
        uint64 cliff;
        uint64 duration;
        bool revoked;
    }

    mapping(address => StakePosition[]) private _stakes;
    mapping(address => VestingSchedule[]) private _vestings;

    event WarSystemUpdated(address indexed warSystem);
    event Staked(address indexed account, uint256 indexed stakeId, uint256 amount, uint64 unlockAt);
    event Unstaked(address indexed account, uint256 indexed stakeId, uint256 amount);
    event VestingCreated(address indexed beneficiary, uint256 indexed vestingId, uint256 amount, uint64 start, uint64 cliff, uint64 duration);
    event VestingReleased(address indexed beneficiary, uint256 indexed vestingId, uint256 amount);
    event WarBurn(address indexed defeatedPlayer, uint256 amount);

    modifier onlyWarSystem() {
        require(msg.sender == warSystem, "NationToken: caller is not WarSystem");
        _;
    }

    constructor(address treasury) ERC20("NationChain", "NATION") Ownable(msg.sender) {
        require(treasury != address(0), "NationToken: treasury zero");
        _mint(treasury, MAX_SUPPLY);
    }

    /// @notice Sets the WarSystem contract allowed to burn defeated balances.
    function setWarSystem(address newWarSystem) external onlyOwner {
        require(newWarSystem != address(0), "NationToken: war system zero");
        warSystem = newWarSystem;
        emit WarSystemUpdated(newWarSystem);
    }

    /// @notice Stakes NATION for time-weighted governance power.
    /// @param amount Token amount to lock.
    /// @param lockSeconds Lock duration between 1 and 730 days.
    function stake(uint256 amount, uint64 lockSeconds) external nonReentrant {
        require(amount > 0, "NationToken: amount zero");
        require(lockSeconds >= MIN_STAKE_LOCK && lockSeconds <= MAX_STAKE_LOCK, "NationToken: invalid lock");
        _transfer(msg.sender, address(this), amount);
        uint64 unlockAt = uint64(block.timestamp) + lockSeconds;
        _stakes[msg.sender].push(StakePosition({amount: amount, unlockAt: unlockAt}));
        emit Staked(msg.sender, _stakes[msg.sender].length - 1, amount, unlockAt);
    }

    /// @notice Withdraws a matured stake position.
    function unstake(uint256 stakeId) external nonReentrant {
        require(stakeId < _stakes[msg.sender].length, "NationToken: bad stake");
        StakePosition storage position = _stakes[msg.sender][stakeId];
        require(position.amount > 0, "NationToken: already withdrawn");
        require(block.timestamp >= position.unlockAt, "NationToken: still locked");
        uint256 amount = position.amount;
        position.amount = 0;
        _transfer(address(this), msg.sender, amount);
        emit Unstaked(msg.sender, stakeId, amount);
    }

    /// @notice Returns live voting power from all active stake positions.
    function governancePower(address account) public view returns (uint256 power) {
        StakePosition[] memory positions = _stakes[account];
        for (uint256 i = 0; i < positions.length; i++) {
            if (positions[i].amount == 0 || block.timestamp >= positions[i].unlockAt) continue;
            uint256 remaining = positions[i].unlockAt - block.timestamp;
            power += positions[i].amount + ((positions[i].amount * remaining) / MAX_STAKE_LOCK);
        }
    }

    /// @notice Returns all stake positions for an account.
    function stakesOf(address account) external view returns (StakePosition[] memory) {
        return _stakes[account];
    }

    /// @notice Creates a funded linear vesting schedule for team or treasury recipients.
    function createVesting(address beneficiary, uint256 amount, uint64 start, uint64 cliff, uint64 duration) external onlyOwner nonReentrant {
        require(beneficiary != address(0), "NationToken: beneficiary zero");
        require(amount > 0, "NationToken: amount zero");
        require(duration > 0 && cliff <= duration, "NationToken: invalid schedule");
        _transfer(msg.sender, address(this), amount);
        _vestings[beneficiary].push(VestingSchedule(amount, 0, start, cliff, duration, false));
        emit VestingCreated(beneficiary, _vestings[beneficiary].length - 1, amount, start, cliff, duration);
    }

    /// @notice Releases vested NATION to the caller.
    function releaseVested(uint256 vestingId) external nonReentrant {
        require(vestingId < _vestings[msg.sender].length, "NationToken: bad vesting");
        VestingSchedule storage schedule = _vestings[msg.sender][vestingId];
        require(!schedule.revoked, "NationToken: revoked");
        uint256 releasable = vestedAmount(msg.sender, vestingId) - schedule.releasedAmount;
        require(releasable > 0, "NationToken: nothing releasable");
        schedule.releasedAmount += releasable;
        _transfer(address(this), msg.sender, releasable);
        emit VestingReleased(msg.sender, vestingId, releasable);
    }

    /// @notice Computes vested amount for a beneficiary schedule.
    function vestedAmount(address beneficiary, uint256 vestingId) public view returns (uint256) {
        VestingSchedule memory schedule = _vestings[beneficiary][vestingId];
        if (block.timestamp < schedule.start + schedule.cliff || schedule.revoked) return 0;
        if (block.timestamp >= schedule.start + schedule.duration) return schedule.totalAmount;
        return (schedule.totalAmount * (block.timestamp - schedule.start)) / schedule.duration;
    }

    /// @notice Returns all vesting schedules for a beneficiary.
    function vestingsOf(address beneficiary) external view returns (VestingSchedule[] memory) {
        return _vestings[beneficiary];
    }

    /// @notice Burns tokens from a defeated player after war resolution.
    function burnFromWar(address defeatedPlayer, uint256 amount) external onlyWarSystem {
        require(defeatedPlayer != address(0), "NationToken: player zero");
        uint256 balance = balanceOf(defeatedPlayer);
        uint256 burnAmount = amount > balance ? balance : amount;
        if (burnAmount > 0) {
            _burn(defeatedPlayer, burnAmount);
            emit WarBurn(defeatedPlayer, burnAmount);
        }
    }
}
