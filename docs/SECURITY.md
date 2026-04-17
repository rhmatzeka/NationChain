# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in NationChain, please report it responsibly:

### How to Report

1. **DO NOT** open a public GitHub issue
2. Email: security@rhmatzeka.dev (or create a private security advisory)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Response Time**: Within 48 hours
- **Updates**: Every 7 days until resolved
- **Fix Timeline**: Critical issues within 7 days, others within 30 days
- **Credit**: Security researchers will be credited (if desired)

## Security Measures

### Smart Contracts
- ✅ OpenZeppelin battle-tested contracts
- ✅ Access control with Ownable pattern
- ✅ Reentrancy guards on critical functions
- ✅ Input validation and sanitization
- ⚠️ Audits: Pending (testnet only)

### Backend
- ✅ Environment variables for sensitive data
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Input validation with Zod
- ✅ Rate limiting (coming soon)

### Frontend
- ✅ No private keys stored in browser
- ✅ MetaMask integration for wallet security
- ✅ HTTPS only in production
- ✅ XSS protection
- ✅ CSRF tokens (coming soon)

## Best Practices for Users

### Wallet Security
- 🔐 Never share your private key
- 🔐 Use hardware wallets for large amounts
- 🔐 Verify contract addresses before transactions
- 🔐 Enable 2FA on MetaMask if available

### Smart Contract Interactions
- ✅ Always verify transaction details
- ✅ Check gas fees before confirming
- ✅ Use testnet (Sepolia) for testing
- ✅ Start with small amounts

### Account Security
- 🔒 Use strong passwords
- 🔒 Don't reuse passwords
- 🔒 Be wary of phishing attempts
- 🔒 Verify URLs before connecting wallet

## Known Issues

### Testnet Only
⚠️ **NationChain is currently on Sepolia testnet**
- Not audited for mainnet
- Use only test ETH
- No real financial value

### Smart Contract Risks
⚠️ **Experimental Features**
- War system is in beta
- Token economics may change
- NFT metadata may be updated

## Security Checklist

Before deploying to mainnet:
- [ ] Professional smart contract audit
- [ ] Penetration testing
- [ ] Bug bounty program
- [ ] Insurance coverage
- [ ] Emergency pause mechanism
- [ ] Upgrade path for contracts
- [ ] Multi-sig for admin functions

## Contact

- **Security Email**: security@rhmatzeka.dev
- **GitHub**: [@rhmatzeka](https://github.com/rhmatzeka)
- **Discord**: Coming soon

---

**Last Updated**: April 17, 2026
