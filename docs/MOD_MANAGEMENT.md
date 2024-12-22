# Mod Management System

## Overview
The mod management system handles server mods, updates, and configurations.

## Commands
```bash
# Add Workshop Mod
!add_workshop_mod <mod_url>

# Remove Workshop Mod
!remove_workshop_mod <mod_url>

# List Current Mods
!list_mods

# Check for Updates
!check_mod_updates
```

## Automatic Update Detection
- Checks every hour for mod updates
- Notifies admins of available updates
- Option for automatic server restart on updates

## Configuration Options
```json
{
    "modUpdateInterval": 3600,
    "autoRestartOnUpdate": true,
    "updateWarningTime": 15,
    "nonPublicModLogging": false
}
```

## Update Process
1. Detect mod updates
2. Notify administrators
3. Schedule server restart
4. Apply updates
5. Verify mod integrity

## Troubleshooting
- Verify Steam Workshop connectivity
- Check mod permissions
- Validate mod configurations
- Review update logs
