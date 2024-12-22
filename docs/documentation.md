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
REDIS_URL=your_redis_url
```

## Usage Guide
### Starting the Application
```bash
npm start
```

### Using the UI
1. **Server Control Tab**
   - Start/Stop server
   - View console output
   - Monitor performance

2. **Discord Bot Tab**
   - Manage bot settings
   - View command usage
   - Configure permissions

3. **Mod Manager Tab**
   - Install/Update mods
   - Configure load order
   - Check compatibility

4. **Backup Manager Tab**
   - Create/Restore backups
   - Configure backup schedule
   - Manage backup storage

5. **Settings Tab**
   - Update server settings
   - Manage admin credentials
   - Configure RCON settings

6. **Logs Tab**
   - View system logs
   - Filter logs by type
   - Export logs

## API Documentation
### Endpoints
- **GET /api/server/status**: Get the current server status.
- **POST /api/server/start**: Start the server.
- **POST /api/server/stop**: Stop the server.
- **POST /api/server/restart**: Restart the server.
- **GET /api/discord/commands**: Get the list of available Discord commands.
- **POST /api/discord/command**: Execute a Discord command.
- **GET /api/mods**: Get the list of installed mods.
- **POST /api/mods/install**: Install a new mod.
- **POST /api/mods/update**: Update an existing mod.
- **GET /api/backups**: Get the list of backups.
- **POST /api/backups/create**: Create a new backup.
- **POST /api/backups/restore**: Restore a backup.
- **GET /api/logs**: Get the system logs.

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
