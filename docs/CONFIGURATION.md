# Configuration Guide

## Environment Settings
Create `.env` file in root directory:
```env
# Required
DISCORD_TOKEN=your_bot_token
RCON_HOST=localhost
RCON_PORT=27015
RCON_PASSWORD=your_rcon_password

# Optional
LOG_LEVEL=info
BACKUP_PATH=./backups
```

## Shop Configuration
Edit `config/shop.json`:
```json
[
  {
    "name": "Water Bottle",
    "id": "Base.WaterBottleFull",
    "quantity": 1,
    "cost": 100
  }
]
```

## Points System
Points are automatically synchronized with game data every 5 minutes.
Manual configuration in `data/points.json` is not recommended.

## Death Messages
Edit `config/death_messages.json`:
```json
[
  "{player} met their end via {cause}",
  "{player} has fallen to {cause}"
]
```

## Wheel Spins
Edit `config/wheel.json`:
```json
[
  {
    "name": "Common Reward",
    "id": "Base.FirstAidKit",
    "quantity": 1,
    "weight": 40
  }
]
```

## Performance Monitoring
Default thresholds:
- CPU: 80%
- Memory: 90%
- Disk Space: 90%

## Backup Configuration
- Default interval: 6 hours
- Retention: 5 backups
- Path: ./backups
