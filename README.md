# PzBotz - Project Zomboid Discord Bot

## Description
A Windows-only Discord bot for managing Project Zomboid servers with RCON support, automated backups, and monitoring.

## Features
- Auto server restart management
- Server performance monitoring (RAM/CPU)
- Automated backup system
- Discord command interface
- RCON command execution
- Player management
- Real-time server metrics
- File-based configuration
- Windows-optimized

## Prerequisites
- Windows OS
- Node.js 16 or higher
- .NET Framework 4.7.2
- Project Zomboid Dedicated Server

## Installation

1. Download the latest release
2. Extract to your Project Zomboid Dedicated Server folder
3. Rename your server startup file to `server.bat`
4. Create `bot_token.txt` and paste your Discord bot token

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

### Public Channel
- `!bot_info` - Display bot information
- `!server_status` - Check server status
- `!restart_time` - View next restart time
- `!game_date` - Show in-game date

### Admin Channel
- `!set_command_channel` - Set admin channel
- `!set_log_channel` - Set logging channel
- `!set_public_channel` - Set public channel
- `!backup_server` - Create server backup
- `!get_ram_cpu` - Show resource usage
- `!restart_server` - Restart the server

## Support
- For issues, create a GitHub issue
- Reference the docs folder for detailed guides

## Limitations
- Windows OS only
- Single Discord server support
- File-based storage only (no database)

## License
MIT License - See LICENSE file for details