# Configuration Guide

## Environment Variables

```env
# Required Settings
BOT_TOKEN=your_discord_bot_token
RCON_HOST=your_server_ip
RCON_PORT=27015
RCON_PASSWORD=your_rcon_password

# Optional Settings
REDIS_HOST=localhost
REDIS_PORT=6379
MONGODB_URI=mongodb://localhost:27017/pzbot
LOG_LEVEL=info
```

## Rate Limiting Configuration

```javascript
{
    commands: {
        points: 20,
        duration: 60,
        blockDuration: 60
    },
    api: {
        points: 100,
        duration: 300,
        blockDuration: 600
    }
}
```

## Server Settings

1. RCON Configuration
   ```json
   {
     "host": "156.38.164.50",
     "port": 27015,
     "password": "Smart123",
     "timeout": 5000
   }
   ```

2. Backup Settings
   ```json
   {
     "backupInterval": 1440,
     "maxBackups": 7,
     "compressionLevel": 9
   }
   ```

3. Monitoring Settings
   ```json
   {
     "checkInterval": 300,
     "alertThresholds": {
       "cpu": 80,
       "memory": 85,
       "disk": 90
     }
   }
   ```

## Permission Levels

```javascript
{
    OWNER: 4,    // Full access
    ADMIN: 3,    // Server management
    MOD: 2,      // Player management
    USER: 1,     // Basic commands
    GUEST: 0     // View only
}
```

## Feature Flags

```javascript
{
    enableWebsocket: true,
    enableDatabase: true,
    enableCache: true,
    enableMetrics: true
}
```

## Channel Configuration

```javascript
{
    commandChannel: "channel_id",
    logChannel: "channel_id",
    alertChannel: "channel_id"
}
```

## Updating Configuration

1. Update Environment
   ```bash
   nano .env
   ```

2. Update Bot Settings
   ```bash
   !reloadconfig
   ```

3. Apply Changes
   ```bash
   npm run update:config
   ```

## Security Settings

```javascript
{
    maxLoginAttempts: 3,
    sessionTimeout: 3600,
    requireAuth: true
}
