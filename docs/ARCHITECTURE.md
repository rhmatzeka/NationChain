# NationChain Architecture

## System Overview

NationChain is built with a modern full-stack architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (Next.js 14 + React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Map    │  │Dashboard │  │Marketplace│  │ Wallet  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │               │
            ┌───────▼──────┐  ┌────▼──────┐
            │   Backend    │  │ Blockchain │
            │  (Node.js)   │  │  (Sepolia) │
            └───────┬──────┘  └────┬───────┘
                    │               │
            ┌───────▼──────┐  ┌────▼───────┐
            │  PostgreSQL  │  │Smart       │
            │   Database   │  │Contracts   │
            └──────────────┘  └────────────┘
```

## Frontend Architecture

### Pages
- `/` - Landing page
- `/dashboard` - Main game interface with world map
- `/marketplace` - NFT trading
- `/my-nfts` - User's NFT collection
- `/leaderboard` - Rankings
- `/about` - Game information
- `/settings` - User preferences

### Key Components
- `WorldMap` - Leaflet.js interactive map
- `CountryDashboard` - Nation management UI
- `CountryLeaderPopup` - Leader character display
- `YouTubeMusicPlayer` - Background music
- `Header` - Navigation and wallet connection

### State Management
- React hooks for local state
- Wagmi for blockchain state
- Socket.io for real-time updates

## Backend Architecture

### API Endpoints
- `GET /api/countries` - List all countries
- `GET /api/country/:id` - Country details
- `POST /api/country/:id/mint` - Mint country NFT
- `GET /api/player/:wallet` - Player data
- `GET /api/wars/active` - Active battles
- `GET /api/news/feed` - News events
- `GET /api/leaderboard` - Rankings

### Services
- `newsOracle.ts` - Fetch real-world news
- `commodityOracle.ts` - Get oil/gold prices
- `blockchain.ts` - Smart contract interactions
- `dailyReset.ts` - Scheduled tasks

### WebSocket Events
- `country:minted` - New NFT minted
- `war:declared` - War started
- `news:published` - New event
- `player:online` - User connected

## Smart Contract Architecture

### Core Contracts
- `CountryNFT` - ERC-721 country tokens
- `BuildingNFT` - ERC-1155 infrastructure
- `NationToken` - ERC-20 governance token
- `GovToken` - ERC-20 in-game currency
- `GameCore` - Main game logic
- `WarSystem` - Battle mechanics
- `DiplomacySystem` - Alliances
- `Marketplace` - NFT trading

### Contract Interactions
```
User → Frontend → Backend → GameCore → CountryNFT
                                    ↓
                              Update Stats
```

## Database Schema

### Main Tables
- `players` - User accounts
- `countries` - Nation data
- `buildings` - Infrastructure
- `wars` - Battle history
- `news_events` - Real-world events
- `alliances` - Diplomatic relations

## Security

- Private keys stored in environment variables
- Oracle-only functions for minting
- ReentrancyGuard on critical functions
- Input validation with Zod
- CORS protection
- Rate limiting (planned)

---

Built by Rahmat Eka Satria
