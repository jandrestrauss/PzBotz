# PZBotz - Project Zomboid Server Management Suite

## Overview
PZBotz is a comprehensive UI-based management tool for Project Zomboid servers that combines:
- Server management and monitoring
- Discord bot integration
- Mod management
- Backup systems
- Player management
- Performance monitoring

## Installation
1. Download the latest release
2. Install dependencies: `npm install`
3. Configure your settings in `.env`
4. Start the application: `npm start`

## Features
### Server Management
- One-click server start/stop/restart
- Real-time server status monitoring
- Integrated console view
- Performance metrics

### Discord Integration
- Player commands
- Server status updates
- Admin controls
- Ticket system
- Points system

### Mod Management
- Automatic mod updates
- Mod conflict detection
- Workshop integration
- Load order management

### Backup System
- Automated backups
- Manual backup triggers
- Backup rotation
- Quick restore functionality

## Configuration
### Required Environment Variables
```env
DISCORD_TOKEN=your_bot_token
ZOMBOID_SERVER_PATH=path_to_server
ADMIN_PASSWORD=your_admin_password
RCON_PASSWORD=your_rcon_password
```

## Usage Guide
### Starting the Application
```bash
npm start
```

### Using the UI
1. Server Control Tab
   - Start/Stop server
   - View console output
   - Monitor performance

2. Discord Bot Tab
   - Manage bot settings
   - View command usage
   - Configure permissions

3. Mod Manager Tab
   - Install/Update mods
   - Configure load order
   - Check compatibility

4. Backup Manager Tab
   - Create/Restore backups
   - Configure backup schedule
   - Manage backup storage

## API Documentation
// ...existing API documentation...

## Troubleshooting
### Common Issues
- **WebSocket Connection Stability**: Ensure the WebSocket server is running and accessible.
- **Rate Limiting**: If you encounter rate limiting issues, review the rate limiting configuration.
- **Error Handling**: Check the console for detailed error messages.

## Development Guide
### Building from Source
```bash
npm run build
```

### Contributing
1. Fork the repository
2. Create your feature branch
3. Submit a pull request

## License
MIT License
