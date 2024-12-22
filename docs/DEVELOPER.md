# Developer Guide

## Project Structure
```
/PZBotV
├── src/
│   ├── handlers/      # Event and command handlers
│   ├── middleware/    # Auth and rate limiting
│   ├── database/     # Database models
│   ├── utils/        # Utility functions
│   └── websocket/    # WebSocket handlers
├── docs/            # Documentation
└── config/         # Configuration files
```

## Adding New Commands

1. Create Command Handler:
```javascript
class NewCommand {
    constructor(client) {
        this.client = client;
    }

    async execute(message, args) {
        // Command logic here
    }
}
```

2. Register Command:
```javascript
client.commands.set('commandname', new NewCommand(client));
```

## Adding New Features

1. Create Feature Module:
```javascript
// src/features/newFeature.js
class NewFeature {
    constructor(bot) {
        this.bot = bot;
        this.setup();
    }

    async setup() {
        // Setup code
    }
}
```

2. Initialize in Bot:
```javascript
const feature = new NewFeature(this);
```

## Database Schema Changes

1. Create Migration:
```javascript
// src/database/migrations/newMigration.js
module.exports = {
    up: async (db) => {
        // Migration up
    },
    down: async (db) => {
        // Migration down
    }
};
```

## WebSocket Events

1. Add New Event:
```javascript
this.ws.on('newevent', (data) => {
    // Handle event
});
```

## Contributing Guidelines

1. Fork Repository
2. Create Feature Branch
3. Write Tests
4. Submit Pull Request

## Testing
```bash
# Run all tests
npm test

# Run specific test
npm test -- --grep "test name"
```

## Code Style
- Use ES6+ features
- Follow ESLint configuration
- Use async/await for promises
- Document all public methods
