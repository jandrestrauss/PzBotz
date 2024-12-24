# Administrator Guide

## Command Reference

### Server Management
```bash
!server start   # Start the server
!server stop    # Stop the server
!server restart # Restart the server
!backup        # Create backup
```

### Points Management
```bash
!points add <user> <amount>    # Add points
!points remove <user> <amount> # Remove points
!points set <user> <amount>    # Set points
```

### System Commands
```bash
!performance      # View performance
!health          # Server health
!sync_points     # Force points sync
```

## Monitoring

### Performance Metrics
- CPU Usage
- Memory Usage
- Player Count
- Disk Space

### Alert Thresholds
```javascript
CPU_THRESHOLD = 80%    // CPU usage warning
MEM_THRESHOLD = 90%    // Memory usage warning
DISK_THRESHOLD = 90%   // Disk space warning
```

## Maintenance

### Backup Management
- Automatic backups every 6 hours
- Maximum 5 backups kept
- Manual backup with `!backup`

### Log Management
- Rotation every 7 days
- Located in `logs/` directory
- Debug logs in development mode
