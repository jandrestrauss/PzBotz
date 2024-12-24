# Installation Guide

## System Requirements
- Windows Operating System
- Node.js 16 or higher
- .NET Framework 4.7.2
- 2GB RAM minimum
- 1GB free disk space

## Prerequisites
1. Node.js 16.x or higher
2. MongoDB (optional)
3. Redis (optional)
4. Project Zomboid Dedicated Server
5. Discord Bot Token

## Step-by-Step Installation

1. **Download and Extract**
   - Download latest release from GitHub
   - Extract to your Project Zomboid Dedicated Server folder
   - Verify folder structure matches documentation

2. **Dependencies Setup**
   ```bash
   npm install
   ```

3. **Server Configuration**
   - Rename your server startup file to `server.bat`
   - Create `bot_token.txt` in root directory
   - Paste your Discord bot token into `bot_token.txt`

4. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update RCON settings in `.env`:
     ```env
     RCON_HOST=localhost
     RCON_PORT=27015
     RCON_PASSWORD=your_password
     ```

5. **Verify Installation**
   ```bash
   npm run verify
   ```

6. **Start the Bot**
   ```bash
   npm start
   ```

## Post-Installation

1. **Discord Channel Setup**
   - Use `!set_command_channel #channel` for admin commands
   - Use `!set_public_channel #channel` for public commands
   - Use `!set_log_channel #channel` for bot logs

2. **Configure Features**
   - Set up shop items in `config/shop.json`
   - Configure wheel rewards in `config/wheel.json`
   - Add custom death messages in `config/death_messages.json`

## Troubleshooting
- Check logs in `logs/` directory
- Verify RCON connection
- Ensure correct permissions in Discord

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
