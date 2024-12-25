# API Reference Guide

## Service Integration

### Core Services
```javascript
const services = {
    shop: require('./services/shopService'),
    points: require('./services/pointsSystem'),
    backup: require('./services/backupService')
};
```

### Event System
```javascript
// Event subscription
eventManager.on('playerJoin', async (player) => {
    // Handle player join
});

// Event emission
eventManager.emit('customEvent', {
    type: 'SHOP_PURCHASE',
    data: purchaseData
});
```

### WebSocket Events
```javascript
// Event Types
const WS_EVENTS = {
    PLAYER_UPDATE: 'playerUpdate',
    SERVER_STATUS: 'serverStatus',
    METRICS_UPDATE: 'metricsUpdate'
};

// Event Handlers
ws.on(WS_EVENTS.PLAYER_UPDATE, (data) => {
    // Handle player update
});
```

## Error Handling
```javascript
try {
    await service.operation();
} catch (error) {
    if (error instanceof CustomError) {
        // Handle custom error
    }
    throw error;
}
```
