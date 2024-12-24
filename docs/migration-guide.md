# Migration Guide

## Version Updates

### 1.0.0 to 2.0.0
```bash
# Backup configuration
npm run backup:config

# Update dependencies
npm update

# Run migrations
npm run migrate
```

### Breaking Changes
1. Event System Updates
2. Configuration Format
3. Command Structure

## Data Migration

### Points System
```javascript
// Old format to new format
const migratePoints = async () => {
    // Migration logic
};
```

### Configuration Updates
```bash
# Validate new config
npm run validate:config

# Apply changes
npm run update:config
```

## Rollback Procedure
See [Recovery Guide](recovery.md) for details.
