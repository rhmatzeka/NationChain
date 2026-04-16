// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Marketplace
/// @notice ETH marketplace for Country NFTs and other ERC-721 NationChain assets with treasury royalties.
contract Marketplace is Ownable, ReentrancyGuard {
    struct Listing {
        uint256 id;
        address seller;
        address tokenAddress;
        uint256 tokenId;
        uint256 priceInETH;
        bool active;
    }

    struct Offer {
        address buyer;
        uint256 amount;
        uint64 expiresAt;
    }

    uint256 public nextListingId = 1;
    address public treasury;
    uint16 public royaltyBps = 250;

    mapping(uint256 => Listing) public listings;
    mapping(address => mapping(uint256 => Offer)) public offers;

    event TreasuryUpdated(address indexed treasury);
    event RoyaltyUpdated(uint16 royaltyBps);
    event NFTListed(uint256 indexed listingId, address indexed seller, address indexed tokenAddress, uint256 tokenId, uint256 priceInETH);
    event ListingCancelled(uint256 indexed listingId);
    event NFTPurchased(uint256 indexed listingId, address indexed buyer, uint256 priceInETH, uint256 royalty);
    event OfferMade(address indexed tokenAddress, uint256 indexed tokenId, address indexed buyer, uint256 amount, uint64 expiresAt);
    event OfferAccepted(address indexed tokenAddress, uint256 indexed tokenId, address indexed seller, address buyer, uint256 amount);
    event OfferCancelled(address indexed tokenAddress, uint256 indexed tokenId, address indexed buyer);

    constructor(address _treasury) Ownable(msg.sender) {
        require(_treasury != address(0), "Marketplace: treasury zero");
        treasury = _treasury;
    }

    /// @notice Updates the royalty treasury.
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Marketplace: treasury zero");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    /// @notice Updates royalty bps, capped at 10%.
    function setRoyaltyBps(uint16 newRoyaltyBps) external onlyOwner {
        require(newRoyaltyBps <= 1_000, "Marketplace: royalty too high");
        royaltyBps = newRoyaltyBps;
        emit RoyaltyUpdated(newRoyaltyBps);
    }

    /// @notice Lists an ERC-721 NFT for ETH.
    function listNFT(address tokenAddress, uint256 tokenId, uint256 priceInETH) external returns (uint256 listingId) {
        require(priceInETH > 0, "Marketplace: price zero");
        IERC721 token = IERC721(tokenAddress);
        require(token.ownerOf(tokenId) == msg.sender, "Marketplace: not owner");
        require(token.getApproved(tokenId) == address(this) || token.isApprovedForAll(msg.sender, address(this)), "Marketplace: not approved");
        listingId = nextListingId++;
        listings[listingId] = Listing(listingId, msg.sender, tokenAddress, tokenId, priceInETH, true);
        emit NFTListed(listingId, msg.sender, tokenAddress, tokenId, priceInETH);
    }

    /// @notice Cancels a listing.
    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.active, "Marketplace: inactive");
        require(listing.seller == msg.sender, "Marketplace: not seller");
        listing.active = false;
        emit ListingCancelled(listingId);
    }

    /// @notice Buys a listed NFT, paying a 2.5% default royalty to treasury.
    function buyNFT(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Marketplace: inactive");
        require(msg.value == listing.priceInETH, "Marketplace: wrong ETH");
        listing.active = false;
        uint256 royalty = (msg.value * royaltyBps) / 10_000;
        uint256 sellerAmount = msg.value - royalty;
        IERC721(listing.tokenAddress).safeTransferFrom(listing.seller, msg.sender, listing.tokenId);
        _sendETH(treasury, royalty);
        _sendETH(listing.seller, sellerAmount);
        emit NFTPurchased(listingId, msg.sender, msg.value, royalty);
    }

    /// @notice Makes an ETH offer for a specific ERC-721 token.
    function makeOffer(address tokenAddress, uint256 tokenId, uint64 expiresAt) external payable nonReentrant {
        require(msg.value > 0, "Marketplace: offer zero");
        require(expiresAt > block.timestamp, "Marketplace: expired");
        Offer storage previous = offers[tokenAddress][tokenId];
        if (previous.amount > 0) _sendETH(previous.buyer, previous.amount);
        offers[tokenAddress][tokenId] = Offer(msg.sender, msg.value, expiresAt);
        emit OfferMade(tokenAddress, tokenId, msg.sender, msg.value, expiresAt);
    }

    /// @notice Accepts the active offer for a token.
    function acceptOffer(address tokenAddress, uint256 tokenId) external nonReentrant {
        IERC721 token = IERC721(tokenAddress);
        require(token.ownerOf(tokenId) == msg.sender, "Marketplace: not owner");
        Offer memory offer = offers[tokenAddress][tokenId];
        require(offer.amount > 0 && offer.expiresAt >= block.timestamp, "Marketplace: no offer");
        delete offers[tokenAddress][tokenId];
        uint256 royalty = (offer.amount * royaltyBps) / 10_000;
        token.safeTransferFrom(msg.sender, offer.buyer, tokenId);
        _sendETH(treasury, royalty);
        _sendETH(msg.sender, offer.amount - royalty);
        emit OfferAccepted(tokenAddress, tokenId, msg.sender, offer.buyer, offer.amount);
    }

    /// @notice Cancels the caller's active offer.
    function cancelOffer(address tokenAddress, uint256 tokenId) external nonReentrant {
        Offer memory offer = offers[tokenAddress][tokenId];
        require(offer.buyer == msg.sender, "Marketplace: not buyer");
        delete offers[tokenAddress][tokenId];
        _sendETH(msg.sender, offer.amount);
        emit OfferCancelled(tokenAddress, tokenId, msg.sender);
    }

    function _sendETH(address to, uint256 amount) private {
        if (amount == 0) return;
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Marketplace: ETH transfer failed");
    }
}
