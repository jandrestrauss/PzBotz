# Development Guide

## Project Architecture
```
/PZBotV
├── src/
│   ├── handlers/         # Event and command handlers
│   ├── middleware/       # Authentication and rate limiting
│   ├── database/        # Database models and connections
│   ├── websocket/       # WebSocket handling
│   ├── cache/           # Redis caching
│   └── utils/           # Utility functions
├── docs/               # Documentation
└── config/            # Configuration files
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

## Monitoring & Logs
- Check `logs/` directory for application logs
- Monitor Redis using `redis-cli monitor`
- Use MongoDB Compass for database inspection

## Testing
```bash
npm test                 # Run all tests
npm run test:unit       # Unit tests only
npm run test:integration # Integration tests only
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

## Security Considerations
- Keep bot token secure
- Regularly rotate API keys
- Monitor rate limits
- Review audit logs
