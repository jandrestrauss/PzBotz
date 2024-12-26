# PzBotz - Project Zomboid Discord Bot

## Description
A Windows-only Discord bot for managing Project Zomboid servers with RCON support, automated backups, and monitoring.

## Features
- Auto server restart and monitoring
- Points system with in-game synchronization
- Shop system with customizable items
- Wheel spins event system
- Death message system with custom messages
- Performance monitoring and charts
- Automated backup system
- Log analysis and health monitoring
- Multi-language support
- Windows-optimized for PZ servers

## Prerequisites
- Windows OS
- Node.js 16+
- .NET Framework 4.7.2
- Project Zomboid Dedicated Server
- Discord Bot Token

## Quick Start
1. Download latest release
2. Extract to Project Zomboid Server directory
3. Rename server start file to `server.bat`
4. Create `bot_token.txt` with your Discord bot token
5. Run `npm install`
6. Start with `npm start`

## Configuration Files
- `config/shop.json` - Shop items configuration
- `config/wheel.json` - Wheel spin rewards
- `config/death_messages.json` - Custom death messages
- `data/points.json` - Points storage
- `.env` - Environment configuration

## Configuration

### Required Settings
```env
DISCORD_TOKEN=your_discord_bot_token
RCON_HOST=your_server_ip
RCON_PORT=27015
RCON_PASSWORD=your_rcon_password
```

### Optional Settings
```env
LOG_LEVEL=info
BACKUP_PATH=/path/to/backups
```

## Commands

### Public Commands
- `!points` - Check your points
- `!shop` - View shop items
- `!buy <item>` - Purchase items
- `!wheelspin` - Spin for rewards
- `!server_status` - Check server status

### Admin Commands
- `!performance` - View performance charts
- `!backup` - Create server backup
- `!health` - Server health status
- `!config` - Manage server settings

## Directory Structure
```
/
├── config/           # Configuration files
├── data/            # Data storage
├── docs/            # Documentation
├── logs/            # Application logs
├── src/             # Source code
└── backups/         # Server backups
```

## Documentation
See the [docs](./docs) directory for detailed guides:
- [Installation Guide](./docs/installation.md)
- [Configuration Guide](./docs/configuration.md)
- [Admin Guide](./docs/admin.md)
- [API Reference](./docs/api.md)
- [Troubleshooting](./docs/troubleshooting.md)

## Support
Create an issue for:
- Bug reports
- Feature requests
- Documentation improvements

## Limitations
- Windows OS only
- Single Discord server support
- File-based storage only (no database)

## License
MIT License - See LICENSE file for details