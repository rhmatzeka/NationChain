// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title GovToken
/// @notice Daily utility token used for construction, research, defense boosts, and production actions.
contract GovToken is ERC20, ERC20Burnable, Ownable {
    address public gameCore;

    event GameCoreUpdated(address indexed gameCore);

    modifier onlyGameCore() {
        require(msg.sender == gameCore, "GovToken: caller is not GameCore");
        _;
    }

    constructor(address treasury) ERC20("NationChain Governance Utility", "GOV") Ownable(msg.sender) {
        require(treasury != address(0), "GovToken: treasury zero");
        _mint(treasury, 1_000_000 ether);
    }

    /// @notice Sets the only address allowed to mint GOV.
    function setGameCore(address newGameCore) external onlyOwner {
        require(newGameCore != address(0), "GovToken: game core zero");
        gameCore = newGameCore;
        emit GameCoreUpdated(newGameCore);
    }

    /// @notice Mints GOV from verified game production.
    function mint(address to, uint256 amount) external onlyGameCore {
        require(to != address(0), "GovToken: recipient zero");
        _mint(to, amount);
    }

    /// @notice Burns GOV from a player when GameCore executes an in-game purchase.
    function burnFromGame(address from, uint256 amount) external onlyGameCore {
        _burn(from, amount);
    }
}
