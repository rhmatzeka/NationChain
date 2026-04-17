# 💰 NationChain Token Economics

## Overview

NationChain uses a dual-token economy to balance gameplay incentives and create sustainable value for players.

## Tokens

### 🪙 NATION Token (ERC-20)

**Contract Address**: `0xDAf3e1329452B65c53FeA3E57D1161A313fa428a` (Sepolia)

**Purpose**: Main game currency and governance token

**Supply**: 
- Initial: 1,000,000 NATION
- Max Supply: Unlimited (mintable by GameCore)

**Earning Methods**:
1. **War Victories**: Win wars to earn NATION rewards
2. **Achievements**: Complete milestones and challenges
3. **Staking Rewards**: Stake GOV to earn NATION
4. **Marketplace**: Trade Country NFTs and Buildings

**Use Cases**:
1. **Declare War**: 1000 NATION per war declaration
2. **Build Structures**: Various costs depending on building type
3. **Military Boost**: Stake to increase military power
4. **Governance**: Vote on game proposals (coming soon)
5. **Trading**: Buy/sell on marketplace

**Staking Mechanics**:
- Stake 1000 NATION = +10 Military Power (permanent)
- No lock-up period
- Instant military boost
- Staked tokens remain in your wallet

---

### 💎 GOV Token (ERC-20)

**Contract Address**: `0x077Ff1092d66c59F4e0F7033318841CF714E7940` (Sepolia)

**Purpose**: Daily utility token for in-game actions

**Supply**:
- Initial: 1,000,000 GOV (treasury)
- Minted daily by backend oracle

**Earning Methods**:
1. **Daily Claim**: Automatic rewards based on country stats
   - Formula: `GDP/80 + Happiness*2 + Oil*1.2`
   - Example: GDP 5000, Happiness 70, Oil 60 = 275 GOV/day
2. **War Victories**: Bonus GOV for winning battles
3. **Events**: Real-world news can grant GOV bonuses

**Use Cases**:
1. **Construction**: Build factories, barracks, embassies
2. **Research**: Unlock new technologies
3. **Defense Boosts**: Temporary military enhancements
4. **Production**: Speed up resource generation
5. **Diplomacy**: Create alliances and trade deals

**Claiming Mechanics**:
- Claim once per day
- Tokens minted directly to wallet
- No gas fees (backend oracle pays)
- Instant transfer

---

### 🏛️ Country NFT (ERC-721)

**Contract Address**: `0x5bc8a05eDA72B75804d132C4EaAC64e7760D1738` (Sepolia)

**Purpose**: Represents ownership of a nation

**Supply**: 180 total (one per real-world country)

**Minting**:
- Cost: Variable (set by marketplace)
- One-time mint per country
- Includes all country stats and metadata

**Metadata**:
```json
{
  "name": "United States",
  "isoCode": "US",
  "stats": {
    "gdp": 25000,
    "population": 331000000,
    "militaryPower": 1500,
    "happiness": 75,
    "oilReserves": 500,
    "territory": 9834000
  }
}
```

**Trading**:
- Tradeable on marketplace
- Price determined by stats and performance
- Ownership tracked on-chain

---

### 🏗️ Building NFT (ERC-1155)

**Contract Address**: `0xA575220407aD65938463311Fe9734407c0B382bf` (Sepolia)

**Purpose**: Represents infrastructure and improvements

**Types**:
1. **Factory** (ID: 0) - Increases GDP
2. **Barracks** (ID: 1) - Increases military
3. **Oil Derrick** (ID: 2) - Increases oil production
4. **Embassy** (ID: 3) - Improves diplomacy
5. **Research Lab** (ID: 4) - Unlocks technologies

**Minting**:
- Cost: Varies by building type (GOV tokens)
- Multiple buildings per country
- Upgradeable levels

---

## Economic Loops

### Daily Loop
```
1. Claim GOV tokens (based on GDP/Happiness/Oil)
   ↓
2. Use GOV to build structures
   ↓
3. Structures increase GDP/Military/Resources
   ↓
4. Higher stats = More GOV tomorrow
```

### War Loop
```
1. Stake NATION to boost military
   ↓
2. Declare war (costs 1000 NATION)
   ↓
3. Win battle
   ↓
4. Earn NATION rewards + territory
   ↓
5. Reinvest in military
```

### Trading Loop
```
1. Mint/acquire Country NFTs
   ↓
2. Improve country stats
   ↓
3. Sell on marketplace for profit
   ↓
4. Buy better countries or more NATION
```

---

## Token Distribution

### NATION Token
- 40% - War Rewards Pool
- 20% - Staking Rewards
- 15% - Team & Development
- 15% - Marketing & Partnerships
- 10% - Treasury Reserve

### GOV Token
- 50% - Daily Claims (minted on-demand)
- 20% - Event Rewards
- 15% - Treasury Reserve
- 10% - Team Operations
- 5% - Airdrops & Promotions

---

## Value Accrual

### For NATION Holders
- Governance rights (coming soon)
- Military power boost
- War participation
- Marketplace trading
- Staking rewards

### For GOV Holders
- In-game utility
- Construction and upgrades
- Defense mechanisms
- Production boosts
- Diplomatic actions

### For NFT Holders
- Country ownership
- Daily GOV generation
- War participation
- Marketplace trading
- Prestige and rankings

---

## Anti-Inflation Mechanisms

1. **NATION Burn**: 10% of war costs burned
2. **GOV Burn**: Used tokens burned from circulation
3. **NFT Scarcity**: Limited to 180 countries
4. **Staking Lock**: Reduces circulating supply
5. **Building Costs**: Deflationary pressure on GOV

---

## Future Developments

- **DAO Governance**: NATION holders vote on game changes
- **Liquidity Pools**: DEX integration for trading
- **Cross-Chain**: Bridge to other networks
- **NFT Marketplace**: P2P trading platform
- **Tournament Rewards**: Competitive seasons with prizes

---

**Last Updated**: April 17, 2026
