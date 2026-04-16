// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title CountryNFT
/// @notice ERC-721 countries with live on-chain NationChain strategy attributes.
contract CountryNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 public constant MAX_COUNTRIES = 180;
    address public gameCore;
    uint256 public totalMinted;

    struct CountryStats {
        uint256 gdp;
        uint256 population;
        uint256 militaryPower;
        uint256 happiness;
        uint256 oilReserves;
        uint256 territory;
    }

    mapping(uint256 => CountryStats) private _stats;
    mapping(uint256 => string) private _names;
    mapping(uint256 => string) private _isoCodes;

    event GameCoreUpdated(address indexed gameCore);
    event CountryMinted(uint256 indexed tokenId, address indexed owner, string name, string isoCode);
    event CountryStatsUpdated(uint256 indexed tokenId, CountryStats stats);

    modifier onlyGameCore() {
        require(msg.sender == gameCore, "CountryNFT: caller is not GameCore");
        _;
    }

    constructor() ERC721("NationChain Country", "COUNTRY") Ownable(msg.sender) {}

    /// @notice Sets the GameCore address allowed to mint and update country stats.
    function setGameCore(address newGameCore) external onlyOwner {
        require(newGameCore != address(0), "CountryNFT: game core zero");
        gameCore = newGameCore;
        emit GameCoreUpdated(newGameCore);
    }

    /// @notice Mints one of the 180 country NFTs.
    function mintCountry(address to, uint256 tokenId, string calldata name, string calldata isoCode, CountryStats calldata initialStats) external onlyGameCore {
        require(tokenId > 0 && tokenId <= MAX_COUNTRIES, "CountryNFT: invalid id");
        require(_ownerOf(tokenId) == address(0), "CountryNFT: already minted");
        _safeMint(to, tokenId);
        totalMinted += 1;
        _names[tokenId] = name;
        _isoCodes[tokenId] = isoCode;
        _stats[tokenId] = initialStats;
        emit CountryMinted(tokenId, to, name, isoCode);
        emit CountryStatsUpdated(tokenId, initialStats);
    }

    /// @notice Updates live stats after production, war, news, or diplomacy effects.
    function updateStats(uint256 tokenId, CountryStats calldata newStats) external onlyGameCore {
        require(_ownerOf(tokenId) != address(0), "CountryNFT: nonexistent token");
        require(newStats.happiness <= 100, "CountryNFT: happiness > 100");
        _stats[tokenId] = newStats;
        emit CountryStatsUpdated(tokenId, newStats);
    }

    /// @notice Returns country metadata fields and stats in one read.
    function getCountry(uint256 tokenId) external view returns (string memory name, string memory isoCode, CountryStats memory stats) {
        require(_ownerOf(tokenId) != address(0), "CountryNFT: nonexistent token");
        return (_names[tokenId], _isoCodes[tokenId], _stats[tokenId]);
    }

    /// @notice Returns country stats.
    function statsOf(uint256 tokenId) external view returns (CountryStats memory) {
        require(_ownerOf(tokenId) != address(0), "CountryNFT: nonexistent token");
        return _stats[tokenId];
    }

    /// @notice Returns a dynamic SVG-backed JSON metadata document.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "CountryNFT: nonexistent token");
        CountryStats memory s = _stats[tokenId];
        string memory name = _names[tokenId];
        string memory svg = string.concat(
            "<svg xmlns='http://www.w3.org/2000/svg' width='720' height='720' viewBox='0 0 720 720'>",
            "<defs><linearGradient id='g' x1='0' x2='1'><stop stop-color='#07111f'/><stop offset='1' stop-color='#1f3f46'/></linearGradient></defs>",
            "<rect width='720' height='720' fill='url(#g)'/>",
            "<rect x='36' y='36' width='648' height='648' rx='28' fill='none' stroke='#30e8bd' stroke-width='4'/>",
            "<text x='56' y='104' fill='#e8fff8' font-size='44' font-family='monospace'>",
            name,
            "</text>",
            _metric("GDP", s.gdp.toString(), 180),
            _metric("POP", s.population.toString(), 250),
            _metric("MIL", s.militaryPower.toString(), 320),
            _metric("HAPPY", s.happiness.toString(), 390),
            _metric("OIL", s.oilReserves.toString(), 460),
            _metric("LAND", s.territory.toString(), 530),
            "</svg>"
        );
        string memory image = string.concat("data:image/svg+xml;base64,", Base64.encode(bytes(svg)));
        string memory json = Base64.encode(bytes(string.concat(
            '{"name":"NationChain ', name,
            '","description":"Live geopolitical country NFT for NationChain.","image":"', image,
            '","attributes":[', _attr("GDP", s.gdp), ",", _attr("Population", s.population), ",",
            _attr("Military Power", s.militaryPower), ",", _attr("Happiness", s.happiness), ",",
            _attr("Oil Reserves", s.oilReserves), ",", _attr("Territory", s.territory), "]}"
        )));
        return string.concat("data:application/json;base64,", json);
    }

    function _metric(string memory label, string memory value, uint256 y) private pure returns (string memory) {
        return string.concat(
            "<text x='72' y='", y.toString(), "' fill='#7fffd4' font-size='28' font-family='monospace'>",
            label,
            "</text><text x='240' y='", y.toString(), "' fill='#ffffff' font-size='28' font-family='monospace'>",
            value,
            "</text>"
        );
    }

    function _attr(string memory trait, uint256 value) private pure returns (string memory) {
        return string.concat('{"trait_type":"', trait, '","value":', value.toString(), "}");
    }
}
