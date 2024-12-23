# Metrics System

## Overview
The metrics system collects and monitors various performance metrics of the bot and the Project Zomboid server.

## Available Metrics
- CPU Usage
- Memory Usage
- Server Uptime
- Player Count
- Network Statistics
- Disk Usage

## API Endpoints

### GET /api/metrics/current
Returns current metrics data.

### GET /api/metrics/history
Returns historical metrics data.

## Configuration
Metrics collection interval and retention period can be configured in the `.env` file:

```env
METRICS_INTERVAL=60000
METRICS_RETENTION_DAYS=30
```

## Usage
```javascript
const metrics = require('./metrics/performanceMonitor');
metrics.startMonitoring();
```

## Dashboard Integration
The metrics are automatically displayed in the web dashboard under the "Performance" tab.
