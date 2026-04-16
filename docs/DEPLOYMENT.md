# Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Ethereum wallet with Sepolia ETH
- Domain name (optional)

## Environment Setup

### 1. Backend Environment

Create `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nationchain"
PORT=4000
SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
ORACLE_PRIVATE_KEY=0x...
GAME_CORE_ADDRESS=0x...
WAR_SYSTEM_ADDRESS=0x...
COUNTRY_NFT_ADDRESS=0x...
```

### 2. Frontend Environment

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
NEXT_PUBLIC_COUNTRY_NFT_ADDRESS=0x...
NEXT_PUBLIC_GAME_CORE_ADDRESS=0x...
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel
```bash
cd frontend
vercel --prod
```

#### Backend on Railway
1. Connect GitHub repository
2. Select `backend` folder
3. Add environment variables
4. Deploy

### Option 2: Docker

```bash
docker-compose up -d
```

### Option 3: VPS (Ubuntu)

```bash
# Install dependencies
sudo apt update
sudo apt install nodejs npm postgresql nginx

# Setup database
sudo -u postgres createdb nationchain

# Clone and install
git clone https://github.com/rhmatzeka/NationChain.git
cd NationChain
npm install

# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "nationchain-backend" -- run start:backend
pm2 start npm --name "nationchain-frontend" -- run start:frontend
```

## Database Migration

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

## Smart Contract Deployment

```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

## Monitoring

- Use PM2 for process management
- Setup logging with Winston
- Monitor with Grafana/Prometheus
- Error tracking with Sentry

## Backup

```bash
# Database backup
pg_dump nationchain > backup.sql

# Restore
psql nationchain < backup.sql
```

---

Built by Rahmat Eka Satria
