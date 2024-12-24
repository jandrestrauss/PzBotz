# PZBotV API Documentation

## Endpoints

### Server Status
```http
GET /api/status
```
Returns current server status including player count, CPU usage, and memory usage.

### Player Statistics
```http
GET /api/players/:steamId/stats
```
Returns statistics for a specific player.

### Server Management
```http
POST /api/server/restart
Authorization: Bearer <token>
```
Schedules a server restart.

## WebSocket Events

### Subscribe to Updates
```json
{
    "type": "subscribe_stats"
}
```

### Receive Updates
```json
{
    "type": "stats_update",
    "data": {
        "playerCount": 10,
        "cpu": 45,
        "memory": 60
    }
}
```

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

### User Management
- `GET /api/users` - List users
- `PUT /api/users/:id/settings` - Update user settings

### Statistics
- `GET /api/stats/realtime` - Fetch real-time statistics data
- `GET /api/stats/detailed` - Fetch detailed statistics data

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

## New Features

### Real-time Statistics API
- Endpoint: `/api/stats/realtime`
- Method: GET
- Description: Fetch real-time statistics data.

### User Management API
- Endpoint: `/api/users`
- Method: GET, POST, PUT, DELETE
- Description: Manage users in the system.

# API Documentation

## Services

### PointsSystem
```javascript
const pointsSystem = require('../services/pointsSystem');

// Get points
await pointsSystem.getPoints(userId);

// Add points
await pointsSystem.addPoints(userId, amount);

// Remove points
await pointsSystem.removePoints(userId, amount);
```

### GameDataSync
```javascript
const gameDataSync = require('../services/gameDataSync');

// Get player stats
const stats = gameDataSync.getPlayerStats(username);

// Force sync
await gameDataSync.syncGameData();
```

### Performance Monitoring
```javascript
const monitor = require('../services/healthMonitor');

// Get current stats
const stats = monitor.getStatus();

// Run health check
await monitor.runHealthChecks();
```

## Events
```javascript
monitor.on('healthCheckFailed', (data) => {
  console.log(`Health check failed: ${data.name}`);
});

gameDataSync.on('pointsMismatch', (data) => {
  console.log(`Points mismatch for ${data.userId}`);
});
```
