# Service Integration Guide

## Core Integration

### Service Registration
```javascript
// Register new service
applicationManager.registerService('customService', {
    name: 'Custom Service',
    dependencies: ['points', 'shop'],
    initialize: async () => {
        // Initialization code
    }
});
```

### Event Integration
```javascript
// Listen for events
eventManager.on('serviceEvent', async (data) => {
    // Handle event
});

// Emit events
eventManager.emit('customEvent', { 
    type: 'UPDATE',
    data: payload 
});
```

## Health Monitoring

### Health Checks
```javascript
class ServiceHealth {
    async checkHealth() {
        return {
            status: 'healthy',
            lastCheck: Date.now(),
            metrics: {
                responseTime: 100,
                activeConnections: 5
            }
        };
    }
}
```

## Error Handling
```javascript
try {
    await service.operation();
} catch (error) {
    if (error.code === 'SERVICE_ERROR') {
        await service.recover();
    }
    throw error;
}
```

## Best Practices
1. Implement graceful shutdown
2. Add health checks
3. Use dependency injection
4. Handle errors properly
