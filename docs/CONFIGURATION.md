# Configuration Guide

## Environment Variables
```env
# Required
DISCORD_TOKEN=your_bot_token
RCON_HOST=localhost
RCON_PORT=27015
RCON_PASSWORD=secure_password

# Optional
LOG_LEVEL=info
BACKUP_PATH=./backups
```

## Configuration Files

### shop.json
```json
{
    "items": [
        {
            "id": "Base.BaseballBat",
            "name": "Baseball Bat",
            "cost": 100
        }
    ]
}
```

### wheel.json
```json
{
    "rewards": [
        {
            "id": "Base.FirstAidKit",
            "name": "First Aid Kit",
            "weight": 10
        }
    ]
}
```

### config.json
```json
{
    "backups": {
        "maxBackups": 5,
        "interval": "0 */6 * * *"
    },
    "monitoring": {
        "checkInterval": 300000,
        "alertThresholds": {
            "cpu": 80,
            "memory": 90
        }
    }
}
```
