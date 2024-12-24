# Command Creation Guide

## Basic Command Structure
```javascript
const Command = require('../base/Command');

class NewCommand extends Command {
    constructor() {
        super('commandName', 'Command description', {
            permissions: ['REQUIRED_PERMISSION'],
            cooldown: 5, // seconds
            category: 'general'
        });
    }

    async execute(message, args) {
        // Command implementation
    }
}
```

## Command Types
1. Public Commands: `src/commands/public/`
2. Admin Commands: `src/commands/admin/`
3. System Commands: `src/commands/system/`

## Best Practices
- Input validation
- Error handling
- Permission checking
- Rate limiting
- Event logging

## Testing Commands
```javascript
describe('NewCommand', () => {
    test('should execute successfully', async () => {
        // Test implementation
    });
});
