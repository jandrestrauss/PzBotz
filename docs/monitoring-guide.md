# Monitoring Guide

## Metrics Collection

### System Metrics
```javascript
// Available metrics
{
    "cpu": "Percentage",
    "memory": "Usage in MB",
    "disk": "Free space",
    "uptime": "Seconds"
}
```

### Application Metrics
```javascript
// Performance monitoring
{
    "requests": "Count/minute",
    "responseTime": "Milliseconds",
    "errors": "Count/hour"
}
```

## Alert Configuration

### Thresholds
```json
{
    "warning": {
        "cpu": 70,
        "memory": 80,
        "disk": 85
    },
    "critical": {
        "cpu": 90,
        "memory": 95,
        "disk": 95
    }
}
```

## Dashboard Access

### Metrics API
```bash
# Get current metrics
GET /api/metrics/current

# Get historical data
GET /api/metrics/history?hours=24
```

### WebSocket Events
```javascript
// Subscribe to real-time updates
ws.on('metrics', (data) => {
    updateDashboard(data);
});
