# Deployment Guide

## Production Setup

### Prerequisites
- Node.js 16+
- PM2 or similar process manager
- Windows Server 2019/2022

### System Requirements
- 2GB RAM minimum
- 2 CPU cores
- 20GB disk space

### Environment Preparation
```bash
# Install required tools
npm install -g pm2 windows-build-tools

# Configure environment
copy .env.example .env
notepad .env
```

### Service Installation
```powershell
# Install as Windows service
npm run install-service

# Configure service
sc config PZBotz start= auto
sc description PZBotz "Project Zomboid Discord Bot"
```

### Deployment Steps
```bash
# Clone repository
git clone https://github.com/yourusername/PzBotz.git

# Install dependencies
npm ci --production

# Configure environment
cp .env.example .env
# Edit .env with production values

# Start with PM2
pm2 start ecosystem.config.js
```

### Monitoring Setup
```javascript
// PM2 configuration
module.exports = {
    apps: [{
        name: 'pzbotz',
        script: './src/index.js',
        env: {
            NODE_ENV: 'production'
        },
        instances: 1,
        autorestart: true
    }]
};
```

### Monitoring
```bash
# View logs
pm2 logs PzBotz

# Monitor status
pm2 monit

# Check health
pm2 status
```

### Backup Strategy
- Automated daily backups
- Weekly full backups
- Monthly archives
- Verification checks

## Maintenance

### Updates
1. Backup configuration
2. Stop service
3. Update files
4. Verify config
5. Start service

### Logs
- Application: `logs/app.log`
- Errors: `logs/error.log`
- Access: `logs/access.log`

## Payment Integration Deployment

### Prerequisites
1. SSL Certificate
2. Payment Provider Credentials
3. Webhook Endpoints
4. Database Access

### Environment Setup
```bash
# Payment Provider Configuration
export PAYSTACK_MODE=production
export PAYSTACK_SECRET_KEY=sk_live_xxxxx
export PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
export PAYSTACK_WEBHOOK_URL=https://your-domain.com/webhook/paystack

# Security Settings
export WEBHOOK_SECRET=your_webhook_secret
export API_KEY=your_api_key
```

### Deployment Checklist
- [ ] SSL Certificate Valid
- [ ] Environment Variables Set
- [ ] Database Migrations Run
- [ ] Webhook URLs Configured
- [ ] Test Transactions Verified
- [ ] Monitoring Setup
- [ ] Backup System Active

### Rollback Procedure
1. Transaction Backup
2. Database Restore Point
3. Previous Version Deploy
4. Provider Notification
5. Customer Communication
