# Configuration Guide

## Environment Setup

### Required Environment Variables
```env
# Discord Configuration
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret

# Server Configuration
PZ_SERVER_HOST=156.38.164.50
PZ_SERVER_RCON_PORT=27015
PZ_SERVER_RCON_PASSWORD=Smart123
PZ_SERVER_PATH=C:/pzserver/server.bat

# Database Configuration (Optional)
MONGODB_URI=mongodb://localhost:27017/pzbot
REDIS_HOST=localhost
REDIS_PORT=6379

# API Keys
BATTLEMETRICS_API_KEY=your_api_key

# Feature Flags
ENABLE_DASHBOARD=true
ENABLE_WEBSOCKET=true
ENABLE_DATABASE=false
```

### Rate Limiting Configuration
```json
{
  "rateLimit": {
    "commands": {
      "points": 20,
      "duration": 60,
      "blockDuration": 60
    },
    "api": {
      "points": 100,
      "duration": 300,
      "blockDuration": 600
    }
  }
}
```

### Monitoring Configuration
```json
{
  "monitoring": {
    "checkInterval": 300,
    "healthCheck": {
      "cpu": 80,
      "memory": 85,
      "disk": 90
    },
    "backup": {
      "interval": 1440,
      "retention": 7
    }
  }
}
```

## Channel Setup
1. Command Channel: Administrative commands
2. Public Channel: User commands
3. Log Channel: Server events and notifications
4. Death Log Channel: Player death notifications
5. Wheel Spin Channel: Wheel spin events

## Permission Levels
- OWNER (4): Full system access
- ADMIN (3): Server management
- MOD (2): Player management
- USER (1): Basic commands
- GUEST (0): View only

## Feature Configuration
1. Points System:
   - Default ticket price: 500
   - Daily limit: 3 tickets
   - Points expiry: 30 days

2. Backup System:
   - Interval: 24 hours
   - Retention: 7 days
   - Compression: Enabled

3. Monitoring System:
   - Health check interval: 5 minutes
   - Stats retention: 30 days
   - Alert thresholds: Configurable

4. WebSocket:
   - Heartbeat interval: 30 seconds
   - Reconnect attempts: 5
   - Message queue size: 100
