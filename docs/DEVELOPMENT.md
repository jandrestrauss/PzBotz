# Development Guide

## Architecture Overview
```
src/
├── core/           # Core application components
├── services/       # Service implementations
├── utils/          # Utility functions
├── bot/           # Discord bot implementation
└── monitoring/    # System monitoring
```

## Core Components
1. WebSocket Manager
   - Real-time updates
   - Connection management
   - Heartbeat monitoring

2. Rate Limiting
   - Redis-based rate limiting
   - Command throttling
   - API protection

3. Authentication
   - Session management
   - Role-based access
   - Discord OAuth2

4. Database Integration
   - MongoDB for persistence
   - Redis for caching
   - Migration system

## Setup Instructions
1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your values
```

3. Start Redis:
```bash
docker-compose up -d redis
```

4. Start MongoDB:
```bash
docker-compose up -d mongodb
```

5. Start development server:
```bash
npm run dev
```

## Adding New Features

### 1. Service Implementation
```javascript
class NewService {
    constructor() {
        this.initialize();
    }

    async start() {
        // Implementation
    }

    async stop() {
        // Cleanup
    }
}
```

### 2. Register with ApplicationManager
```javascript
// In applicationManager.js
this.services.set('newService', new NewService());
```

## Adding New Commands
1. Create command file in `src/commands/`
2. Extend base Command class
3. Implement execute method
4. Register in CommandHandler

Example:
```javascript
class NewCommand extends Command {
    constructor() {
        super('commandname', 'description');
    }

    async execute(message, args) {
        // Implementation
    }
}
```

## Event System
Events use a publish-subscribe pattern:
```javascript
// Subscribe to events
eventManager.subscribe('eventName', (data) => {
    // Handle event
});

// Publish events
eventManager.handleEvent('eventName', data);
```

## Services
- Use dependency injection
- Implement event emitters
- Add error handling
- Document public methods

## Monitoring & Logs
- Check `logs/` directory for application logs
- Monitor Redis using `redis-cli monitor`
- Use MongoDB Compass for database inspection

## Testing
```bash
npm test               # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Generate coverage
```

## Deployment
1. Build application:
```bash
npm run build
```

2. Deploy using PM2:
```bash
pm2 start ecosystem.config.js
```

## Code Style
- Use ESLint configuration
- Follow naming conventions
- Add JSDoc comments
- Write unit tests

## Error Handling
```javascript
try {
    await riskyOperation();
} catch (error) {
    logger.error('Operation failed:', error);
    throw new CustomError(error);
}
```

## Security Considerations
- Keep bot token secure
- Regularly rotate API keys
- Monitor rate limits
- Review audit logs
