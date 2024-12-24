# Configuration Reference

## Core Configuration

### Environment Variables
```env
# Required
DISCORD_TOKEN=your_bot_token
RCON_HOST=localhost
RCON_PORT=27015
RCON_PASSWORD=secure_password

# Optional
LOG_LEVEL=info
BACKUP_PATH=./backups
METRICS_INTERVAL=60000
```

### Service Configuration

#### Monitoring Settings
```json
{
  "thresholds": {
    "cpu": 80,
    "memory": 90,
    "disk": 85
  },
  "intervals": {
    "metrics": 30000,
    "health": 60000
  }
}
```

#### Backup Configuration
```json
{
  "schedule": "0 */6 * * *",
  "maxBackups": 5,
  "compression": true,
  "excludePaths": [
    "logs",
    "cache"
  ]
}
```

## Feature Configuration

### Shop System
```json
{
  "items": [
    {
      "id": "BaseballBat",
      "name": "Baseball Bat",
      "cost": 100
    }
  ],
  "enableTrading": true,
  "dailyLimit": 5
}
```

### Points System
```json
{
  "startingPoints": 0,
  "dailyBonus": 100,
  "commandCosts": {
    "wheelspin": 50,
    "teleport": 200
  }
}
```

## Advanced Settings

### Performance Tuning
```json
{
  "cacheSize": 1000,
  "workerThreads": 2,
  "cleanupInterval": 3600000
}
