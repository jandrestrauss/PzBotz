# API Documentation

## WebSocket Events

### Server Status Updates
```javascript
{
    type: 'serverStatus',
    data: {
        status: boolean,
        players: number,
        cpu: number,
        memory: number,
        disk: number
    }
}
```

### Player Events
```javascript
{
    type: 'playerEvent',
    event: 'join|leave|death',
    data: {
        player: string,
        timestamp: number,
        details: object
    }
}
```

## REST API Endpoints

### Server Management
- `GET /api/server/status` - Get server status
- `POST /api/server/restart` - Restart server
- `POST /api/server/backup` - Create backup
- `GET /api/server/stats` - Get performance stats

### Player Management
- `GET /api/players` - List online players
- `POST /api/players/kick` - Kick player
- `POST /api/players/ban` - Ban player
- `GET /api/players/:id/stats` - Get player statistics

### Economy System
- `GET /api/economy/balance` - Get user balance
- `POST /api/economy/transfer` - Transfer points
- `POST /api/economy/reward` - Award points

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/status` - Get auth status

## Rate Limits
- API: 100 requests per 5 minutes
- Commands: 20 requests per minute
- Wheel spins: 3 per hour

## Error Responses
```javascript
{
    error: string,
    code: number,
    details?: object
}
```

## WebSocket Connection
```javascript
const ws = new WebSocket('ws://server:port');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Handle different event types
};
```
