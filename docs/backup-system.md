# Backup System Guide

## Configuration
```javascript
const BACKUP_CONFIG = {
    interval: '0 */6 * * *',  // Every 6 hours
    maxBackups: 5,            // Keep last 5 backups
    compression: true,        // Enable compression
    types: ['world', 'config']
};
```

## Backup Commands
```bash
# Manual backup
!backup create

# List backups
!backup list

# Restore backup
!backup restore <timestamp>
```

## Automated Backups
- Scheduled via cron
- Pre-restart backups
- Before mod updates
- Emergency backups

## Best Practices
1. Regular testing
2. Verify integrity
3. Monitor space
4. Secure storage
