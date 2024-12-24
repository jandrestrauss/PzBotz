# Development Guide

## Project Structure
```
src/
├── commands/         # Discord commands
│   ├── admin/       # Admin commands
│   └── public/      # Public commands
├── services/        # Core services
├── utils/           # Utilities
└── monitoring/      # Monitoring system
```

## Service Development

### Base Service Template
```javascript
class CustomService {
    constructor() {
        this.initialize();
    }

    async initialize() {
        // Setup code
    }

    async start() {
        // Start service
    }

    async stop() {
        // Cleanup
    }
}
```

### Error Handling
```javascript
try {
    await operation();
} catch (error) {
    logger.error('Operation failed:', error);
    throw new CustomError('OPERATION_FAILED', error);
}
```

## Testing

### Unit Tests
```javascript
describe('Service', () => {
    beforeEach(() => {
        // Setup
    });

    it('should handle operation', async () => {
        // Test
    });
});
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration

# Run specific tests
npm run test:integration -- --grep "Service"
```

## Deployment

### Production Build
```bash
# Build
npm run build

# Run checks
npm run verify

# Deploy
npm run deploy
```
