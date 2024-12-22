# API Integration Guide

## Supported APIs

### BattleMetrics API
```javascript
const BATTLEMETRICS_ENDPOINTS = {
    PLAYERS: '/players',
    SERVERS: '/servers',
    BANS: '/bans'
};

const REQUIRED_HEADERS = {
    'Authorization': 'Bearer YOUR_API_KEY'
};
```

### Steam Web API
```javascript
const STEAM_ENDPOINTS = {
    PLAYER_SUMMARIES: '/ISteamUser/GetPlayerSummaries/v2/',
    PLAYER_BANS: '/ISteamUser/GetPlayerBans/v1/'
};
```

### Discord API
```javascript
const DISCORD_ENDPOINTS = {
    CHANNELS: '/channels',
    MESSAGES: '/messages',
    WEBHOOKS: '/webhooks'
};
```

### Paystack API
```javascript
const PAYSTACK_ENDPOINTS = {
    TRANSACTIONS: '/transaction',
    VERIFICATION: '/transaction/verify',
    BANKS: '/bank',
    TRANSFERS: '/transfer'
};

const PAYSTACK_HEADERS = {
    'Authorization': 'Bearer YOUR_SECRET_KEY',
    'Content-Type': 'application/json'
};
```

## Rate Limits
1. BattleMetrics: 60 requests/minute
2. Steam Web API: 100,000 requests/day
3. Discord API: Varies by endpoint
4. Paystack API: 2000 requests/minute

## Error Handling
1. API Timeouts: 5 second default
2. Retry Strategy: 3 attempts with exponential backoff
3. Circuit Breaker Pattern for API instability
4. Paystack Specific:
   - Transaction Verification: 3 retries
   - Webhook Timeout: 10 seconds
   - Invalid Transaction: Auto-reversal

## Caching Strategy
1. Player Data: 5 minutes
2. Server Status: 30 seconds
3. Ban Lists: 1 hour
4. Bank Lists: 24 hours
5. Exchange Rates: 1 hour
6. Transaction Status: No cache, real-time only
