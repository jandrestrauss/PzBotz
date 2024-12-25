# API Reference

## Core Services

### Points Service
```javascript
const points = require('../services/pointsSystem');

// Get user points
await points.getPoints(userId);

// Modify points
await points.addPoints(userId, amount);
await points.removePoints(userId, amount);
await points.setPoints(userId, amount);
```

### Game Sync
```javascript
const gameSync = require('../services/gameDataSync');

// Force sync
await gameSync.syncGameData();

// Get player data
const stats = gameSync.getPlayerStats(username);
```

### Server Control
```javascript
const server = require('../services/serverControl');

// Basic controls
await server.start();
await server.stop();
await server.restart();

// Advanced controls
await server.backup();
await server.clean();
```

## Services

### ApplicationManager
```javascript
const applicationManager = require('./core/applicationManager');

// Get service instance
const service = applicationManager.getService('serviceName');

// Get application status
const status = applicationManager.getStatus();
```

### EventManager
```javascript
const eventManager = require('./services/eventManager');

// Subscribe to events
eventManager.subscribe('eventName', callback);

// Emit events
eventManager.handleEvent('eventName', data);
```

### MonitoringService
```javascript
const monitoringService = require('./services/monitoringService');

// Get current metrics
const metrics = monitoringService.getMetrics();
```

## Events
```javascript
// Points events
points.on('pointsChanged', (userId, amount) => {});
points.on('pointsSynced', (stats) => {});

// Server events
server.on('starting', () => {});
server.on('stopping', () => {});
server.on('backup', (status) => {});

// Health events
monitor.on('warning', (metric) => {});
monitor.on('critical', (metric) => {});
```

## WebSocket Events
| Event | Description | Payload |
|-------|-------------|---------|
| metrics | Server metrics update | `{ cpu, memory, players }` |
| alert | System alert | `{ type, message, severity }` |
| status | Server status change | `{ status, timestamp }` |

## Error Handling
```javascript
try {
    await operation();
} catch (error) {
    if (error.code === 'POINTS_SYNC_ERROR') {
        // Handle sync error
    }
}
```

## Server Endpoints

### Status Endpoints
```http
GET /api/server/status
GET /api/server/players
GET /api/server/metrics
```

### Command Endpoints
```http
POST /api/server/command
```

### Monitoring Endpoints
```http
GET /api/metrics/current
GET /api/metrics/history
GET /api/alerts
```

## Authentication
```javascript
// All requests must include:
headers: {
    'Authorization': 'Bearer <token>'
}
```

## Rate Limits
- 100 requests per 15 minutes for standard endpoints
- 30 requests per minute for command endpoints
- 1000 requests per hour for monitoring endpoints
