# Configuration Examples

## Basic Setup
```env
# .env
DISCORD_TOKEN=your_bot_token
RCON_HOST=localhost
RCON_PORT=27015
RCON_PASSWORD=secure_password
LOG_LEVEL=info
BACKUP_PATH=./backups
```

## Shop Configuration
```json
// config/shop.json
[
  {
    "name": "Basic Survival Kit",
    "id": "Base.SurvivalKit",
    "quantity": 1,
    "cost": 1000
  },
  {
    "name": "Premium Weapon",
    "id": "Base.Katana",
    "quantity": 1,
    "cost": 5000
  }
]
```

## Points System
```json
// config/points.json
{
  "dailyBonus": 100,
  "killReward": 10,
  "survivalBonus": 50,
  "maxTransfer": 1000
}
```

## Advanced Settings
```json
// config/advanced.json
{
  "monitoring": {
    "checkInterval": 300,
    "alertThresholds": {
      "cpu": 80,
      "memory": 90,
      "disk": 85
    }
  },
  "backup": {
    "interval": "0 */6 * * *",
    "maxBackups": 5,
    "compressionLevel": 9
  }
}
