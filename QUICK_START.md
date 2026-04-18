# 🚀 Quick Start Guide - NationChain

## Prerequisites
- Node.js v20.10.0+
- Docker Desktop
- MetaMask wallet

## 1. Installation

```bash
git clone https://github.com/rhmatzeka/NationChain.git
cd NationChain
npm install
```

## 2. Database Setup

```bash
# Start PostgreSQL
docker-compose up -d

# Setup database
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run seed
cd ..
```

## 3. Get API Keys (For Real News)

### Option A: Automated Setup (Recommended)
```bash
node scripts/setup-api-keys.js
```

### Option B: Manual Setup

1. **NewsAPI** (Required): https://newsapi.org/register
2. **GNews** (Required): https://gnews.io/register
3. **OpenAI** (Optional): https://platform.openai.com/api-keys
4. **Alpha Vantage** (Optional): https://www.alphavantage.co/support/#api-key

Then update `backend/.env`:
```env
NEWSAPI_KEY=your_newsapi_key_here
GNEWS_API_KEY=your_gnews_key_here
OPENAI_API_KEY=sk-your_openai_key_here  # Optional
ALPHA_VANTAGE_API_KEY=your_key_here     # Optional
```

📖 **Detailed guide**: [docs/API_KEYS_SETUP.md](./docs/API_KEYS_SETUP.md)

## 4. Test API Keys

```bash
cd backend
npm run test:apis
```

Expected output:
```
✅ NewsAPI: Working! (1000+ articles available)
✅ GNews: Working! (5 articles fetched)
⚠️  OpenAI: Not configured (optional)
⚠️  Alpha Vantage: Not configured (optional)

📊 Summary: 2/4 APIs configured and working
✅ News system ready!
```

## 5. Run the Game

### Terminal 1 - Backend
```bash
npm run dev:backend
```

Wait for:
```
✅ NationChain backend listening on http://localhost:4000
✅ Socket.io endpoint ready
✅ Running initial news oracle...
✅ Fetched 15 real-world articles
```

### Terminal 2 - Frontend
```bash
npm run dev:frontend
```

## 6. Play!

Open http://localhost:3000

### First Time Setup:
1. **Connect MetaMask** (top right)
2. **Switch to Sepolia testnet**
3. **Get free Sepolia ETH**: https://sepoliafaucet.com/
4. **Go to Marketplace** → Mint a country
5. **Start playing!**

## 🎮 Game Features

### With Real News APIs:
- ✅ **Real-world news** affecting gameplay
- ✅ **15+ articles** fetched every 30 minutes
- ✅ **AI analysis** (if OpenAI configured)
- ✅ **Country stats** change based on news
- ✅ **Live commodity prices** (if Alpha Vantage configured)

### Without APIs (Demo Mode):
- ⚠️ **8 demo articles** only
- ⚠️ **No updates** after initial load
- ⚠️ **Heuristic analysis** (less accurate)

## 📖 Documentation

- **Gameplay Guide**: [GAMEPLAY.md](./GAMEPLAY.md)
- **API Keys Setup**: [docs/API_KEYS_SETUP.md](./docs/API_KEYS_SETUP.md)
- **Token Economics**: [docs/TOKEN_ECONOMICS.md](./docs/TOKEN_ECONOMICS.md)
- **FAQ**: [docs/FAQ.md](./docs/FAQ.md)
- **Architecture**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check if PostgreSQL is running
docker ps

# If not, start it
docker-compose up -d
```

### News not working
```bash
# Test API keys
cd backend
npm run test:apis

# Check backend logs
# Should see: "Running initial news oracle..."
```

### Frontend won't connect
- Check if backend is running on port 4000
- Check browser console for errors
- Try clearing cache and reload

### MetaMask issues
- Make sure you're on Sepolia testnet
- Get free ETH from faucet
- Check if you have enough gas

## 🎵 Features

- ✅ Epic war music playlist (4 tracks)
- ✅ Real-world news integration
- ✅ Declare wars (1000 NATION tokens)
- ✅ Claim daily GOV tokens
- ✅ Stake NATION for military boost
- ✅ 180 countries as NFTs
- ✅ Real-time WebSocket updates
- ✅ Leader characters with real presidents

## 🔗 Links

- **GitHub**: https://github.com/rhmatzeka/NationChain
- **Creator**: [@rhmatzeka](https://github.com/rhmatzeka)
- **License**: MIT

---

**Need help?** Open an issue on GitHub or check the FAQ!
