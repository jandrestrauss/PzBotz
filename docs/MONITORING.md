# Monitoring Guide

## Server Health Monitoring

### Metrics Tracked
- CPU Usage
- Memory Usage
- Disk Space
- Player Count
- Network Latency
- RCON Connection Status

### Alert Thresholds
```javascript
{
    cpu: 80,      // Alert if CPU usage exceeds 80%
    memory: 85,   // Alert if memory usage exceeds 85%
    disk: 90,     // Alert if disk usage exceeds 90%
    latency: 1000 // Alert if latency exceeds 1000ms
}
```

### Dashboard Metrics
1. Real-time Statistics
   - Player count graph
   - Resource usage graphs
   - Event log stream

2. Historical Data
   - Daily player peaks
   - Resource usage trends
   - Backup status history

### Alert Channels
- Discord notifications
- Email alerts (configurable)
- Dashboard warnings
- Log files

## Log Management

### Log Categories
1. System Logs
   - Server starts/stops
   - Performance metrics
   - Error reports

2. Player Logs
   - Login/logout events
   - Player actions
   - Chat messages

3. Admin Logs
   - Command usage
   - Configuration changes
   - Moderation actions

### Log Rotation
- Daily rotation
- 7-day retention
- Compressed archives
- Automated cleanup

## Performance Monitoring

### Resource Tracking
```javascript
{
    interval: 5000,    // Check every 5 seconds
    samples: 720,      // Keep 1 hour of data
    aggregate: 300000  // Aggregate every 5 minutes
}
```

### Health Checks
- RCON connectivity
- Database connection
- Redis connection
- File system access
- Network latency

## Payment Monitoring

### Key Metrics
1. Transaction Success Rate
2. Payment Processing Time
3. Webhook Reliability
4. Error Rates
5. API Response Times

### Alert Thresholds
```json
{
  "transactions": {
    "successRate": {
      "warning": "95%",
      "critical": "90%"
    },
    "processingTime": {
      "warning": "5s",
      "critical": "10s"
    }
  },
  "webhooks": {
    "deliveryRate": {
      "warning": "98%",
      "critical": "95%"
    }
  }
}
```

### Logging Requirements
1. Transaction IDs
2. Payment Provider Responses
3. Webhook Events
4. Error Stack Traces
5. User Payment Attempts

### Dashboard Metrics
- Daily Transaction Volume
- Average Transaction Value
- Error Distribution
- Response Time Trends
- Provider Status

## Payment Analytics

### Real-time Metrics
```javascript
const PAYMENT_METRICS = {
    successRate: {
        window: '5m',
        threshold: 95
    },
    avgResponseTime: {
        window: '1m',
        threshold: 2000
    },
    errorRate: {
        window: '15m',
        threshold: 5
    }
};
```

### Daily Reports
1. Transaction Volume
2. Success/Failure Ratio
3. Average Transaction Value
4. Peak Transaction Times
5. Revenue Analytics

### Alert Thresholds
```javascript
const ALERT_THRESHOLDS = {
    highErrorRate: 10,
    longResponseTime: 5000,
    failedTransactions: 3,
    webhookFailures: 2
};
```

# PzBotz Monitoring System

## Components Overview

### Performance Monitoring
- Real-time CPU and memory usage tracking
- Performance graphs with historical data
- Metrics collected every 5 seconds

### Error Handling
- Error boundary implementation for crash recovery
- Centralized error logging system
- Error persistence and reporting

### Recovery System
- Automatic recovery attempts for system failures
- Progressive recovery strategy
- User notifications for recovery status

### User Notifications
- Toast-style notifications for system events
- Different notification types (info, warning, error, success)
- Auto-dismissing notifications after 5 seconds

## Implementation Details

### Performance Graph
```typescript
interface PerformanceData {
  timestamp: number;
  cpuUsage: number;
  memoryUsage: number;
}
```
The performance graph displays real-time metrics with a 20-point historical view.

### Recovery Status
```typescript
interface RecoveryStatusProps {
  isRecovering: boolean;
  lastError?: string;
  recoveryAttempts: number;
}
```
Tracks and displays system recovery attempts with user notifications.

### Error Monitoring
Errors are automatically:
1. Captured by ErrorBoundary
2. Logged to the server
3. Trigger recovery mechanisms
4. Notify users of status

## Usage Example

```typescript
// Wrap your app with error boundary and notification provider
<ErrorBoundary>
  <NotificationProvider>
    <MonitoringDashboard />
  </NotificationProvider>
</ErrorBoundary>

// Show notifications
const { showNotification } = useNotification();
showNotification("System recovering...", "warning");
```

## Configuration

Default intervals:
- Performance metrics: 5 seconds
- Notification duration: 5 seconds
- Recovery attempts: Progressive backoff

## Recovery Strategy

1. First attempt: Immediate
2. Subsequent attempts: Exponential backoff
3. Maximum attempts: 3 before requiring manual intervention
4. User notification at each step

# Monitoring System Documentation

## Components

### Metrics Collection
- CPU, Memory, Disk usage monitoring
- Player count tracking
- Performance analysis (trends, anomalies, forecasting)

### Recovery System
- Automatic recovery for system overloads
- Resource-specific recovery actions
- Progressive recovery attempts

### Real-time Monitoring
- Live performance graphs
- System metrics dashboard
- Error tracking and reporting

## Architecture

### UnifiedMonitor
```typescript
interface MetricReport {
    timestamp: number;
    metrics: {
        cpu: number;
        memory: number;
        disk: number;
        players: number;
    };
    analysis: {
        trend: boolean;
        anomaly: boolean;
        forecast: boolean;
    };
}
```

### Recovery System
```typescript
interface RecoveryPlan {
    actions: {
        type: 'scale' | 'optimize';
        resource: string;
        target: number;
    }[];
    priority: 'low' | 'medium' | 'high';
    timeout: number;
}
```

## Usage

### Initialization
```typescript
const monitor = new UnifiedMonitor();
await monitor.initializeMonitoring();
```

### Metric Collection
```typescript
const metrics = await monitor.collectMetrics();
```

### Recovery Actions
```typescript
await monitor.handleOverload({
    bottleneck: 'memory',
    optimal: 75,
    severity: 'high',
    critical: true
});
```

## Thresholds

Default warning thresholds:
- CPU: 75%
- Memory: 80%
- Disk: 90%

Critical thresholds:
- CPU: 90%
- Memory: 95%
- Disk: 95%

## Components Overview

### PerformanceGraph
- Real-time performance visualization
- 20-point historical view
- Auto-updating every 5 seconds

### SystemMetrics
- Current system status display
- Visual alerts for threshold breaches
- Resource usage indicators

### ErrorList
- Error tracking and display
- Resolution status tracking
- Error history maintenance

### RecoveryStatus
- Recovery progress monitoring
- Attempt counting
- Success/failure tracking

## Error Handling

The system implements:
- Error boundary protection
- Automatic recovery attempts
- Error logging and reporting
- User notifications for critical issues

## Best Practices

1. Monitor thresholds regularly
2. Review error logs daily
3. Tune recovery parameters based on system performance
4. Keep recovery attempts limited to prevent cascading failures

## Recovery Strategy

1. **Detection**: Monitor system metrics
2. **Analysis**: Identify bottlenecks
3. **Planning**: Create recovery plan
4. **Execution**: Implement recovery actions
5. **Verification**: Confirm system stability

## Configuration

Example configuration:
```typescript
const config = {
    monitoring: {
        interval: 5000,
        historyLength: 20,
        enableAnalysis: true
    },
    recovery: {
        maxAttempts: 3,
        cooldown: 300,
        autoRecover: true
    }
};
```

