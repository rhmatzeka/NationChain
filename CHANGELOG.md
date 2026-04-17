# Changelog

All notable changes to NationChain will be documented in this file.

## [1.2.0] - 2026-04-17

### Added
- ⚔️ **Declare War Backend Integration**: Full API implementation
  - Wars cost 1000 NATION tokens
  - Battle duration: 1 hour
  - Win probability calculation
  - No more gas limit errors
- 💎 **Claim GOV Tokens**: Daily rewards system
  - Formula: GDP/80 + Happiness*2 + Oil*1.2
  - Tokens minted directly to wallet
  - Backend oracle integration
- 🚀 **Stake NATION**: Military boost system
  - 1000 NATION = +10 Military Power
  - Permanent military enhancement
- 🔧 **Smart Contract Scripts**: Permission setup automation
  - GOV token minting permissions
  - Oracle configuration scripts
- 📖 **Gameplay Guide**: Comprehensive GAMEPLAY.md documentation
- 🎓 **Enhanced Tutorial**: Updated with detailed instructions

### Changed
- DeclareWarModal now uses backend API instead of direct blockchain calls
- CountryDashboard with claim/stake functionality and toast notifications
- Backend config with GOV and NATION token addresses
- Improved error handling and loading states

### Fixed
- Gas limit errors when declaring war
- Auto-refresh issue when claiming tokens
- Duplicate variable declarations
- GOV tokens not appearing in wallet

## [1.0.0] - 2026-04-16

### Added
- 🌍 Interactive world map with 180 countries
- 🎮 Country NFT minting system
- ⚔️ War declaration and battle system
- 💰 Dynamic economy with GOV tokens
- 🏗️ Building infrastructure system
- 🤝 Alliance and diplomacy features
- 📰 Real-world news integration
- 🎵 Epic background music
- 👥 Leader character system with real presidents
- 📊 Leaderboard rankings
- 🛒 NFT marketplace
- 📱 Responsive design
- 🔐 MetaMask wallet integration
- ⛓️ Smart contracts deployed on Sepolia
- 🎓 Interactive tutorial system

### Technical
- Next.js 14 frontend
- Node.js + Express backend
- PostgreSQL database
- Solidity smart contracts
- Socket.io real-time updates
- Leaflet.js maps
- Tailwind CSS styling

---

**Built by Rahmat Eka Satria**
