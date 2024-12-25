# Production Deployment Guide

## Pre-deployment Checklist
```bash
# Verify dependencies
npm audit
npm outdated

# Run tests
npm run test:all
npm run test:integration

# Build production
npm run build:prod
```

## Environment Setup
```powershell
# Create service account
New-LocalUser -Name "pzbotz" -Description "PZBotz Service Account"
Add-LocalGroupMember -Group "Administrators" -Member "pzbotz"

# Setup service
sc.exe create PZBotz binPath= "C:\path\to\node.exe C:\path\to\PZBotz\src\index.js"
sc.exe config PZBotz start= auto
sc.exe description PZBotz "Project Zomboid Discord Bot Service"
```

## Security Configuration
```env
# Production environment settings
NODE_ENV=production
LOG_LEVEL=info
ENABLE_METRICS=true
BACKUP_RETENTION_DAYS=30
```

## Monitoring Setup
```javascript
// PM2 configuration (ecosystem.config.js)
module.exports = {
  apps: [{
    name: 'pzbotz',
    script: './src/index.js',
    instances: 1,
    max_memory_restart: '300M',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/error.log',
    out_file: './logs/output.log'
  }]
};
```
