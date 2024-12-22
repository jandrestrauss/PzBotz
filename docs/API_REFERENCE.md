# API Reference

## Authentication
All API endpoints require authentication using either:
- Discord OAuth2 token
- API key in the Authorization header

## Base URL
```
https://your-server/api/v1
```

## REST Endpoints

### Server Management
```http
GET /server/status
POST /server/restart
POST /server/backup
GET /server/stats
```

### Player Management
```http
GET /players/online
POST /players/kick/{playerId}
POST /players/ban/{playerId}
GET /players/{playerId}/stats
```

### Economy System
```http
GET /economy/balance/{userId}
POST /economy/transfer
POST /economy/reward
GET /economy/transactions
```

## WebSocket Events

### Subscribing to Events
```javascript
ws.send(JSON.stringify({
    type: 'subscribe',
    events: ['playerJoin', 'playerLeave', 'serverStatus']
}));
```

### Event Types
1. Server Events
```javascript
{
    type: 'serverStatus',
    data: {
        status: boolean,
        players: number,
        uptime: number,
        cpu: number,
        memory: number
    }
}
```

2. Player Events
```javascript
{
    type: 'playerEvent',
    event: 'join|leave|death',
    data: {
        player: string,
        timestamp: number
    }
}
```

## Rate Limits
- Standard API: 100 requests per 5 minutes
- WebSocket messages: 60 per minute
- Admin endpoints: 1000 requests per hour
