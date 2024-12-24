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
