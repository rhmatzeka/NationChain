# ❓ Frequently Asked Questions (FAQ)

## General Questions

### What is NationChain?
NationChain is a blockchain-powered multiplayer strategy game where you control nations as NFTs, manage economies, declare wars, and compete with other players in real-time.

### Is it free to play?
The game is free to access, but you need:
- Sepolia testnet ETH to mint Country NFTs (free from faucets)
- NATION tokens to declare wars (earned through gameplay)
- GOV tokens for construction (earned daily)

### What blockchain does it use?
Currently on **Ethereum Sepolia Testnet**. Mainnet deployment planned after audits.

### Do I need crypto experience?
Basic knowledge helps, but the tutorial guides you through:
- Setting up MetaMask
- Getting testnet ETH
- Minting NFTs
- Managing tokens

---

## Getting Started

### How do I start playing?
1. Install MetaMask browser extension
2. Add Sepolia testnet to MetaMask
3. Get free Sepolia ETH from faucets
4. Connect wallet at http://localhost:3000
5. Go to Marketplace and mint a country
6. Start managing your nation!

### Where do I get Sepolia ETH?
Free faucets:
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://sepolia-faucet.pk910.de/

### Which country should I choose?
Consider:
- **High GDP** = More GOV tokens daily
- **High Oil** = Bonus GOV tokens
- **High Military** = Better in wars
- **Strategic location** = Easier to defend

Popular choices: USA, China, Germany, Japan, Saudi Arabia

---

## Gameplay

### How do I earn tokens?

**GOV Tokens (Daily)**:
- Claim once per day
- Formula: `GDP/80 + Happiness*2 + Oil*1.2`
- Higher stats = More tokens

**NATION Tokens**:
- Win wars
- Complete achievements
- Trade on marketplace
- Staking rewards (coming soon)

### How do wars work?
1. Go to Military tab
2. Click "Declare War"
3. Select target country
4. Pay 1000 NATION tokens
5. Battle lasts 1 hour
6. Winner determined by military power + randomness
7. Winner gets rewards and territory

### Can I lose my country?
No! Your Country NFT is permanent. You can:
- Lose wars (but keep your country)
- Lose resources temporarily
- Lose military power
- But never lose ownership

### How do I boost my military?
1. **Stake NATION**: 1000 NATION = +10 Military (permanent)
2. **Build Barracks**: Increases military over time
3. **Win Wars**: Gain military experience
4. **Form Alliances**: Shared defense (coming soon)

---

## Tokens & NFTs

### What's the difference between NATION and GOV?

| Feature | NATION | GOV |
|---------|--------|-----|
| Purpose | Main currency | Daily utility |
| Earning | Wars, achievements | Daily claims |
| Uses | Declare war, stake | Build, research |
| Supply | Unlimited | Minted on-demand |

### Can I trade my Country NFT?
Yes! On the marketplace you can:
- List your country for sale
- Buy other countries
- Trade with other players
- Set your own prices

### What happens to my tokens if I sell my country?
- NATION and GOV stay in your wallet
- New owner gets the country stats
- Buildings transfer with the country
- War history is preserved

---

## Technical

### Why is my transaction failing?
Common reasons:
1. **Insufficient gas** - Get more Sepolia ETH
2. **Wrong network** - Switch to Sepolia testnet
3. **Already owned** - Country already minted
4. **Insufficient tokens** - Need more NATION/GOV

### How do I add tokens to MetaMask?
1. Open MetaMask
2. Click "Import tokens"
3. Enter contract addresses:
   - NATION: `0xDAf3e1329452B65c53FeA3E57D1161A313fa428a`
   - GOV: `0x077Ff1092d66c59F4e0F7033318841CF714E7940`
4. Tokens will appear in your wallet

### Can I play on mobile?
Yes! Use MetaMask mobile browser:
1. Open MetaMask app
2. Go to Browser tab
3. Visit http://localhost:3000 (if running locally)
4. Or wait for hosted version

### Is my data safe?
- Private keys never leave your wallet
- Backend doesn't store sensitive data
- All transactions on-chain (transparent)
- Open source code (auditable)

---

## Economy

### How is GDP calculated?
GDP is based on:
- Base country stats (real-world data)
- Buildings constructed
- Resources controlled
- War victories
- Real-world news events

### What affects my daily GOV claim?
Formula: `GDP/80 + Happiness*2 + Oil*1.2`

Factors:
- **GDP**: Economic strength
- **Happiness**: Population satisfaction
- **Oil**: Resource production

Example:
- GDP 5000 → 62.5 GOV
- Happiness 70 → 140 GOV
- Oil 60 → 72 GOV
- **Total: 274.5 GOV/day**

### Can I lose tokens?
Yes, tokens are spent on:
- Declaring wars (1000 NATION)
- Building structures (varies)
- Upgrading buildings (varies)
- Trading fees (coming soon)

---

## Troubleshooting

### Game won't load
1. Check if backend is running: `npm run dev:backend`
2. Check if frontend is running: `npm run dev:frontend`
3. Check if PostgreSQL is running: `docker ps`
4. Clear browser cache
5. Try different browser

### Can't connect wallet
1. Install MetaMask extension
2. Switch to Sepolia testnet
3. Refresh page
4. Click "Connect MetaMask"
5. Approve connection in MetaMask

### Country not showing on map
1. Wait for transaction confirmation
2. Refresh page
3. Check "My NFTs" page
4. Verify ownership on Etherscan

### Claim GOV not working
1. Check if you already claimed today
2. Verify you own the country
3. Check backend logs for errors
4. Ensure GOV_TOKEN_ADDRESS is configured

---

## Community

### Where can I get help?
- GitHub Issues: https://github.com/rhmatzeka/NationChain/issues
- Discord: Coming soon
- Email: support@rhmatzeka.dev

### Can I contribute?
Yes! See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Code contributions
- Bug reports
- Feature requests
- Documentation improvements

### Is there a roadmap?
Check [docs/ARCHITECTURE.md](./ARCHITECTURE.md) for:
- Current features
- Planned features
- Development timeline
- Technical details

---

## Future Plans

### When mainnet?
After:
- ✅ Beta testing complete
- ⏳ Smart contract audits
- ⏳ Security review
- ⏳ Bug bounty program
- ⏳ Community feedback

### What's coming next?
- 🔄 Alliance system
- 🔄 Trading marketplace
- 🔄 Tournament seasons
- 🔄 Mobile app
- 🔄 DAO governance
- 🔄 Cross-chain support

### Will there be a token sale?
No plans currently. Tokens are:
- Earned through gameplay
- Minted by game mechanics
- Distributed fairly to players

---

**Still have questions?** Open an issue on [GitHub](https://github.com/rhmatzeka/NationChain/issues)!
