# 🌍 NationChain

**A blockchain-powered geopolitical strategy game where you control nations, wage wars, and dominate the world economy.**

Built by **Rahmat Eka Satria** | [GitHub](https://github.com/rahmatsatria) | [LinkedIn](https://linkedin.com/in/rahmatsatria)

![NationChain Banner](https://img.shields.io/badge/NationChain-Blockchain%20Strategy%20Game-30e8bd?style=for-the-badge)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?style=for-the-badge&logo=ethereum)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

---

## 🎮 About the Game

NationChain is a full-stack Web3 strategy game that combines:
- **Real-world geopolitics** - Control 180 actual countries as NFTs
- **Blockchain technology** - All assets are on-chain (Ethereum Sepolia)
- **Dynamic economy** - GDP, resources, and token rewards
- **Strategic warfare** - Declare wars, form alliances, conquer territories
- **Real-time events** - Game affected by actual news and commodity prices

### 🎯 Game Features

- 🏛️ **Own Countries as NFTs** - Mint and trade country NFTs on the marketplace
- ⚔️ **Wage Wars** - Attack other nations, defend your territory
- 💰 **Manage Economy** - Control GDP, taxes, resources (oil, gold, iron)
- 🏗️ **Build Infrastructure** - Factories, barracks, oil derricks, embassies
- 🤝 **Diplomacy** - Form alliances, trade with other players
- 📰 **Real-World Integration** - News events affect gameplay
- 🎵 **Epic Soundtrack** - Immersive war music
- 🗺️ **Interactive World Map** - Leaflet.js powered global view

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Wagmi + Viem** - Ethereum interactions
- **Leaflet.js** - Interactive world map
- **Socket.io Client** - Real-time updates

### Backend
- **Node.js + Express** - REST API server
- **TypeScript** - Type-safe backend
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database management
- **Socket.io** - WebSocket server
- **Cron Jobs** - Automated tasks (news, commodities, daily reset)

### Blockchain
- **Solidity** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure contract libraries
- **Ethereum Sepolia** - Testnet deployment

### Smart Contracts
- `CountryNFT.sol` - ERC-721 country tokens with dynamic metadata
- `BuildingNFT.sol` - ERC-1155 infrastructure tokens
- `NationToken.sol` - ERC-20 governance token
- `GovToken.sol` - ERC-20 in-game currency
- `GameCore.sol` - Main game logic
- `WarSystem.sol` - Battle mechanics
- `DiplomacySystem.sol` - Alliance system
- `Marketplace.sol` - NFT trading

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- MetaMask wallet
- Sepolia ETH (from faucet)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rahmatsatria/nationchain.git
cd nationchain
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup PostgreSQL Database**
```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Or use your local PostgreSQL
# Create database: nationchain
```

4. **Configure environment variables**
```bash
# Copy example env files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
cp contracts/.env.example contracts/.env

# Edit .env files with your configuration
```

5. **Run database migrations**
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
cd ..
```

6. **Deploy smart contracts (optional)**
```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
cd ..
```

7. **Start development servers**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

8. **Open the game**
```
Frontend: http://localhost:3000
Backend API: http://localhost:4000
```

---

## 📁 Project Structure

```
nationchain/
├── frontend/              # Next.js frontend
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and configs
│   └── types/           # TypeScript types
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── websocket/   # Socket.io server
│   └── prisma/          # Database schema & migrations
├── contracts/            # Solidity smart contracts
│   ├── contracts/       # Contract source files
│   ├── scripts/         # Deployment scripts
│   └── test/           # Contract tests
└── package.json         # Monorepo root
```

---

## 🎮 How to Play

1. **Connect Wallet** - Click "Connect MetaMask" in the top right
2. **Get Testnet ETH** - Visit [Sepolia Faucet](https://sepoliafaucet.com)
3. **Mint a Country** - Go to Marketplace and mint your first country NFT
4. **Manage Your Nation**:
   - Click your country on the map
   - View stats (GDP, Military, Happiness, Oil)
   - Build infrastructure (Factories, Barracks, etc.)
   - Claim daily GOV token rewards
5. **Expand Your Empire**:
   - Declare war on other countries
   - Form alliances with players
   - Trade resources
   - Climb the leaderboard

---

## 🔗 Deployed Contracts (Sepolia)

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

View on [Sepolia Etherscan](https://sepolia.etherscan.io/)

---

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
npx hardhat test
npx hardhat coverage
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
npm run test
```

---

## 📸 Screenshots

### World Map Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Country Management
![Country Dashboard](docs/screenshots/country-dashboard.png)

### Marketplace
![Marketplace](docs/screenshots/marketplace.png)

### War Room
![War Room](docs/screenshots/war-room.png)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Rahmat Eka Satria**

- GitHub: [@rahmatsatria](https://github.com/rahmatsatria)
- LinkedIn: [Rahmat Eka Satria](https://linkedin.com/in/rahmatsatria)
- Email: rahmat@example.com
- Portfolio: [rahmatsatria.dev](https://rahmatsatria.dev)

---

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Ethereum Foundation for blockchain infrastructure
- Leaflet.js for interactive maps
- Next.js team for the amazing framework
- All contributors and players!

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/rahmatsatria/nationchain?style=social)
![GitHub forks](https://img.shields.io/github/forks/rahmatsatria/nationchain?style=social)
![GitHub issues](https://img.shields.io/github/issues/rahmatsatria/nationchain)
![GitHub license](https://img.shields.io/github/license/rahmatsatria/nationchain)

---

**Built with ❤️ by Rahmat Eka Satria**

*Dominate the world, one block at a time.* 🌍⛓️
