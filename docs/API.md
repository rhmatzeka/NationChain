# API Documentation

## Base URL

```
http://localhost:4000/api
```

## Endpoints

### Countries

#### Get All Countries
```http
GET /api/countries
```

Response:
```json
[
  {
    "id": 1,
    "name": "United States",
    "isoCode": "US",
    "ownerWallet": "0x...",
    "gdp": 27360,
    "military": 9800,
    "happiness": 72,
    "oil": 88,
    "buildings": []
  }
]
```

#### Get Country Details
```http
GET /api/country/:id
```

Response:
```json
{
  "id": 1,
  "name": "United States",
  "warHistory": [],
  "buildings": []
}
```

#### Mint Country NFT
```http
POST /api/country/:id/mint
```

Body:
```json
{
  "wallet": "0x..."
}
```

Response:
```json
{
  "success": true,
  "txHash": "0x...",
  "country": {...}
}
```

### Player

#### Get Player Data
```http
GET /api/player/:wallet
```

Response:
```json
{
  "wallet": "0x...",
  "countries": [],
  "balances": {
    "eth": "0",
    "nation": "0",
    "gov": "0"
  }
}
```

### Wars

#### Get Active Wars
```http
GET /api/wars/active
```

Response:
```json
[
  {
    "id": 1,
    "attackerId": 1,
    "defenderId": 2,
    "status": "active",
    "startTime": "2026-04-16T..."
  }
]
```

### News

#### Get News Feed
```http
GET /api/news/feed?type=all
```

Query params:
- `type`: all | gdp | military | crisis

Response:
```json
[
  {
    "id": 1,
    "headline": "...",
    "eventType": "gdp",
    "severity": 5,
    "affectedCountries": [1, 2, 3]
  }
]
```

### Leaderboard

#### Get Rankings
```http
GET /api/leaderboard
```

Response:
```json
{
  "gdp": [...],
  "military": [...],
  "tokens": [...],
  "wars": [...]
}
```

### Commodities

#### Get Prices
```http
GET /api/commodities
```

Response:
```json
{
  "oilUsd": 82.4,
  "goldUsd": 2380.8,
  "appliedMultiplier": {
    "oil": 1,
    "gold": 1
  }
}
```

## WebSocket Events

Connect to: `ws://localhost:4000/ws`

### Events

#### country:minted
```json
{
  "countryId": 1,
  "owner": "0x...",
  "txHash": "0x..."
}
```

#### war:declared
```json
{
  "warId": 1,
  "attackerId": 1,
  "defenderId": 2
}
```

#### news:published
```json
{
  "headline": "...",
  "affectedCountries": [1, 2]
}
```

## Error Responses

```json
{
  "error": "Error message"
}
```

Status codes:
- 200: Success
- 400: Bad request
- 404: Not found
- 500: Server error

---

Built by Rahmat Eka Satria
