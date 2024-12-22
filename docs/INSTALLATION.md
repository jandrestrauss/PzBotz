# Installation Guide

## Prerequisites
1. Node.js 16.x or higher
2. MongoDB (optional)
3. Redis (optional)
4. Project Zomboid Dedicated Server
5. Discord Bot Token

## Step-by-Step Installation

### 1. Server Setup
```bash
# Clone repository
git clone https://github.com/yourusername/PZBotV.git
cd PZBotV

# Install dependencies
npm install

# Create required directories
node check-directory.js
```

### 2. Configuration Files
```bash
# Create environment file
cp .env.example .env

# Create configuration
cp config.example.json config.json
```

### 3. Database Setup (Optional)
```bash
# Start MongoDB
mongod --dbpath=/data/db

# Start Redis
redis-server
```

### 4. Bot Configuration
1. Create Discord Application
   - Visit Discord Developer Portal
   - Create New Application
   - Add Bot User
   - Copy Bot Token

2. Configure Bot Settings
   - Update .env file with bot token
   - Configure server settings
   - Set up required channels

### 5. Starting the Bot
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Post-Installation

### Verify Installation
1. Check bot online status in Discord
2. Test basic commands
3. Verify database connection
4. Check RCON connectivity

### Security Setup
1. Configure firewalls
2. Set up SSL/TLS
3. Secure sensitive files
4. Configure backup system
