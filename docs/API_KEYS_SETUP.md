# 🔑 API Keys Setup Guide

Untuk mengaktifkan fitur News dengan data real-world, Anda perlu mendapatkan API keys gratis dari beberapa provider.

## 📰 News API Keys

### 1. NewsAPI.org (GRATIS)

**Untuk**: Real-time news dari 80,000+ sources

**Cara Daftar**:
1. Buka https://newsapi.org/register
2. Isi form dengan email Anda
3. Verifikasi email
4. Copy API key dari dashboard
5. **Free tier**: 100 requests/day

**Paste ke**: `backend/.env` → `NEWSAPI_KEY=your_key_here`

---

### 2. GNews API (GRATIS)

**Untuk**: Alternative news source dengan 60+ countries

**Cara Daftar**:
1. Buka https://gnews.io/register
2. Sign up dengan email
3. Verifikasi email
4. Copy API key dari dashboard
5. **Free tier**: 100 requests/day

**Paste ke**: `backend/.env` → `GNEWS_API_KEY=your_key_here`

---

## 🤖 OpenAI API (OPSIONAL - Untuk AI Analysis)

**Untuk**: Analisis news dengan GPT-4 (lebih akurat)

**Cara Daftar**:
1. Buka https://platform.openai.com/signup
2. Sign up dengan email/Google
3. Verifikasi phone number
4. Buka https://platform.openai.com/api-keys
5. Click "Create new secret key"
6. Copy key (hanya muncul sekali!)
7. **Cost**: ~$0.01 per news analysis (sangat murah)

**Paste ke**: `backend/.env` → `OPENAI_API_KEY=sk-your_key_here`

**Note**: Tanpa OpenAI, sistem akan pakai heuristic analysis (tetap berfungsi tapi kurang akurat)

---

## 📊 Alpha Vantage API (OPSIONAL - Untuk Commodity Prices)

**Untuk**: Real-time oil & gold prices

**Cara Daftar**:
1. Buka https://www.alphavantage.co/support/#api-key
2. Isi form dengan email
3. Copy API key dari email
4. **Free tier**: 25 requests/day

**Paste ke**: `backend/.env` → `ALPHA_VANTAGE_API_KEY=your_key_here`

---

## ⚡ Quick Setup Script

Setelah mendapatkan API keys, jalankan script ini:

```bash
# Di root folder project
node scripts/setup-api-keys.js
```

Script akan meminta Anda input API keys satu per satu dan otomatis update `.env` file.

---

## 🧪 Testing API Keys

Setelah setup, test apakah API keys berfungsi:

```bash
cd backend
npm run test:apis
```

Atau manual test:

```bash
# Test NewsAPI
curl "https://newsapi.org/v2/everything?q=geopolitics&apiKey=YOUR_KEY"

# Test GNews
curl "https://gnews.io/api/v4/search?q=geopolitics&apikey=YOUR_KEY"

# Test OpenAI
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_KEY"
```

---

## 📝 Example .env Configuration

```env
# News APIs (Required for real news)
NEWSAPI_KEY=abc123def456ghi789jkl012mno345pqr678
GNEWS_API_KEY=xyz789abc123def456ghi789jkl012mno345

# OpenAI (Optional - for better analysis)
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234

# Alpha Vantage (Optional - for commodity prices)
ALPHA_VANTAGE_API_KEY=ABC123DEF456
```

---

## 🚀 After Setup

1. **Restart backend**:
   ```bash
   npm run dev:backend
   ```

2. **Check logs** untuk konfirmasi:
   ```
   ✅ NewsAPI configured
   ✅ GNews configured
   ✅ OpenAI configured (optional)
   ✅ Running initial news oracle...
   ✅ Fetched 15 real-world articles
   ```

3. **Open game** dan klik tombol "News" - Anda akan lihat berita real-world!

---

## 🆓 Cost Summary

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| NewsAPI | 100 req/day | $449/month |
| GNews | 100 req/day | $9/month |
| OpenAI | $5 credit | ~$0.01/analysis |
| Alpha Vantage | 25 req/day | $50/month |

**Recommended**: Gunakan NewsAPI + GNews (gratis selamanya untuk hobby projects)

---

## ❓ Troubleshooting

### "API key invalid"
- Check apakah key sudah benar (no spaces)
- Verifikasi email di provider
- Tunggu 5-10 menit setelah signup

### "Rate limit exceeded"
- Free tier: 100 requests/day
- News oracle runs setiap 30 menit = 48 requests/day
- Masih aman untuk free tier!

### "No articles fetched"
- Check internet connection
- Verify API keys di .env
- Check backend logs untuk error details

---

## 🔒 Security Notes

- ⚠️ **JANGAN commit API keys ke GitHub!**
- ✅ `.env` sudah di `.gitignore`
- ✅ Gunakan environment variables
- ✅ Rotate keys jika ter-expose

---

**Need help?** Open issue di GitHub atau email: support@rhmatzeka.dev
