# Configuration Guide

## Environment Variables
```env
# Required Settings
BOT_TOKEN=your_discord_bot_token
RCON_PASSWORD=your_rcon_password
BATTLEMETRICS_API_KEY=your_api_key

# Optional Settings
DEBUG_MODE=false
LOG_LEVEL=info
AUTO_RESTART=true
```

## Server Settings
```json
{
    "serverIP": "156.38.164.50",
    "rconPort": 27015,
    "maxPlayers": 32,
    "backupInterval": 360,
    "restartTimes": ["04:00", "16:00"]
}
```

## Discord Channel Setup
```javascript
const channels = {
    commands: "channel_id_for_commands",
    public: "channel_id_for_public",
    logs: "channel_id_for_logs",
    deaths: "channel_id_for_deaths",
    wheelSpin: "channel_id_for_wheel"
}
```

## Points System
```javascript
const pointsConfig = {
    ticketCost: 500,
    dailyLimit: 3,
    bonusMultiplier: 1.5,
    wheelTypes: ['default', 'premium']
}
```

## Security Settings
```javascript
const security = {
    maxLoginAttempts: 3,
    sessionTimeout: 3600,
    requireAuth: true,
    adminRoles: ['Admin', 'Moderator']
}
```

## Monitoring Configuration
```javascript
const monitoring = {
    checkInterval: 300,
    alertThresholds: {
        cpu: 80,
        memory: 85,
        disk: 90
    }
}
```

## File Locations
- Configuration: `/config/`
- Logs: `/logs/`
- Backups: `/backups/`
- Data: `/data/`
