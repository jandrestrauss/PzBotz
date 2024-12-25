# Command Reference

## Public Commands

### Shop System
- `!shop` - View shop items
- `!buy <item>` - Purchase item
- `!points` - Check balance

### Wheel Spins
- `!wheelspin` - Try your luck
- `!rewards` - View possible rewards

### Server Info
- `!status` - Check server status
- `!players` - List online players
- `!uptime` - Server uptime

## Admin Commands

### Server Management
```bash
# Server Control
!server start     # Start server
!server stop      # Stop server
!server restart   # Restart server

# Backup Management
!backup create    # Create backup
!backup list      # List backups
!backup restore   # Restore backup

# Configuration
!config view      # View settings
!config set       # Update setting
```

### Player Management
```bash
!player kick <name> [reason]   # Kick player
!player ban <name> [reason]    # Ban player
!player whitelist add/remove   # Manage whitelist
```

## Permission Levels
- User: Basic commands
- Mod: Player management
- Admin: Server control
- Owner: Full access
