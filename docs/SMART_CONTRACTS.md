# Smart Contracts Documentation

## Deployed Contracts (Sepolia)

| Contract | Address |
|----------|---------|
| CountryNFT | `0x5bc8a05eDA72B75804d132C4EaAC64e7760D1738` |
| BuildingNFT | `0xA575220407aD65938463311Fe9734407c0B382bf` |
| NationToken | `0xDAf3e1329452B65c53FeA3E57D1161A313fa428a` |
| GovToken | `0x077Ff1092d66c59F4e0F7033318841CF714E7940` |
| GameCore | `0x0e313B28f5D15Dbc96E149BBA4FdBD408fa13D5A` |
| WarSystem | `0x56d5303C711A05d60555c2eEc0Fa66e4fC79b170` |
| DiplomacySystem | `0x54a65B0F028ec928BbfFF8304a7f722c17360F93` |
| Marketplace | `0xd67e6B005D088185DC7280929C4747551881ef2A` |

## CountryNFT

ERC-721 token representing countries.

### Key Functions

```solidity
function mintCountry(
    address to,
    uint256 tokenId,
    string calldata name,
    string calldata isoCode,
    CountryStats calldata initialStats
) external onlyGameCore
```

```solidity
function updateStats(
    uint256 tokenId,
    CountryStats calldata newStats
) external onlyGameCore
```

```solidity
function getCountry(uint256 tokenId) 
    external view 
    returns (string memory name, string memory isoCode, CountryStats memory stats)
```

### CountryStats Struct

```solidity
struct CountryStats {
    uint256 gdp;
    uint256 population;
    uint256 militaryPower;
    uint256 happiness;
    uint256 oilReserves;
    uint256 territory;
}
```

## GameCore

Main game logic contract.

### Key Functions

```solidity
function initializeCountry(
    address ownerAddress,
    uint256 countryId,
    string calldata name,
    string calldata isoCode,
    CountryStats calldata stats
) external onlyOracle
```

```solidity
function dailyClaim(uint256 countryId) external nonReentrant
```

```solidity
function buildStructure(
    uint256 countryId,
    uint256 buildingType
) external nonReentrant
```

```solidity
function applyNewsEffect(
    uint256 countryId,
    string calldata effectType,
    int256 magnitude
) external onlyOracle
```

## WarSystem

Battle mechanics contract.

### Key Functions

```solidity
function declareWar(
    uint256 attackerId,
    uint256 defenderId,
    uint256 stakeAmount
) external returns (uint256 battleId)
```

```solidity
function resolveWar(
    uint256 battleId,
    uint256 winnerId
) external onlyOracle
```

## NationToken & GovToken

ERC-20 tokens for governance and in-game currency.

### Key Functions

```solidity
function mint(address to, uint256 amount) external onlyGameCore
```

```solidity
function burnFromGame(address from, uint256 amount) external onlyGameCore
```

## Marketplace

NFT trading contract.

### Key Functions

```solidity
function createListing(
    address nftContract,
    uint256 tokenId,
    uint256 price
) external
```

```solidity
function buyListing(
    address nftContract,
    uint256 tokenId
) external payable
```

## Security Features

- ✅ ReentrancyGuard on critical functions
- ✅ Ownable for admin functions
- ✅ Oracle-only minting
- ✅ Input validation
- ✅ OpenZeppelin libraries

## Testing

```bash
cd contracts
npx hardhat test
npx hardhat coverage
```

## Verification

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

---

Built by Rahmat Eka Satria
