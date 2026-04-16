// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title MockVRF
/// @notice Deterministic-on-chain randomness source for testnet and local NationChain war resolution.
contract MockVRF is Ownable {
    uint256 public nextRequestId = 1;
    mapping(uint256 => uint256) public randomWords;

    event RandomnessRequested(uint256 indexed requestId, address indexed requester);
    event RandomnessFulfilled(uint256 indexed requestId, uint256 randomWord);

    constructor() Ownable(msg.sender) {}

    /// @notice Requests a random word and returns the request id.
    function requestRandomness() external returns (uint256 requestId) {
        requestId = nextRequestId++;
        randomWords[requestId] = uint256(keccak256(abi.encodePacked(block.prevrandao, blockhash(block.number - 1), msg.sender, requestId)));
        emit RandomnessRequested(requestId, msg.sender);
        emit RandomnessFulfilled(requestId, randomWords[requestId]);
    }

    /// @notice Consumes a random word for a completed request.
    function consumeRandomness(uint256 requestId) external view returns (uint256) {
        uint256 word = randomWords[requestId];
        require(word != 0, "MockVRF: randomness missing");
        return word;
    }
}
