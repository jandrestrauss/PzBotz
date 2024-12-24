# Installation Guide

## System Requirements

### Hardware
- CPU: 2+ cores recommended
- RAM: 2GB minimum
- Storage: 1GB free space

### Software
- Windows OS
- Node.js 16+
- .NET Framework 4.7.2
- Project Zomboid Dedicated Server

## Step-by-Step Installation

1. **Download**
```bash
# Clone repository
git clone https://github.com/yourusername/PzBotz.git

# Or download latest release
curl -L https://github.com/yourusername/PzBotz/releases/latest/download/PzBotz.zip -o PzBotz.zip
```

2. **Setup Files**
```bash
# Extract to server directory
unzip PzBotz.zip -d "Project Zomboid Dedicated Server"

# Install dependencies
npm install

# Create required directories
npm run setup
```

3. **Configuration**
```bash
# Create bot token file
echo "your-bot-token" > bot_token.txt

# Copy environment template
cp .env.example .env

# Edit configuration
notepad .env
```

## Verification

```bash
# Test configuration
npm run verify

# Start bot
npm start

# Check logs
tail -f logs/app.log
```

## Common Issues
- Port conflicts: Check RCON port availability
- Permission errors: Run as administrator
- Token issues: Regenerate Discord bot token
````
