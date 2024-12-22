# Deployment Guide

## Production Setup

### System Requirements
- 2GB RAM minimum
- 2 CPU cores
- 20GB disk space
- Windows Server 2019/2022

### Environment Setup
1. Install Required Software
   ```bash
   # Install Node.js LTS
   # Install PM2 globally
   npm install -pm2 -g
   ```

2. Configure Services
   ```bash
   # Create service definitions
   pm2 ecosystem

   # Configure startup
   pm2 startup
   ```

### Deployment Steps

1. Build Application
   ```bash
   npm run build
   ```

2. Configure PM2
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: "pzbot",
       script: "./bot.js",
       env: {
         NODE_ENV: "production"
       },
       log_date_format: "YYYY-MM-DD HH:mm:ss",
       error_file: "logs/error.log",
       out_file: "logs/output.log"
     }]
   }
   ```

3. Start Application
   ```bash
   pm2 start ecosystem.config.js
   ```

### Monitoring
1. PM2 Dashboard
   ```bash
   pm2 monit
   ```

2. Log Management
   ```bash
   # View logs
   pm2 logs pzbot

   # Rotate logs
   pm2 logrotate -u 'dd-MM-yyyy'
   ```

### Backup Strategy
1. Database Backups
2. Configuration Backups
3. Log Archives
4. Server World Backups

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
