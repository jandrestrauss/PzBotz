# Testing Guide

## Running Tests
```bash
# Run all tests
npm test

# Run specific service tests
npm test -- services/metrics
npm test -- services/security

# Generate coverage report
npm run coverage
```

## Test Structure
Tests are organized by service:
```
tests/
├── services/          # Service tests
│   ├── metrics/      # Metrics tests
│   ├── security/     # Security tests
│   └── recovery/     # Recovery tests
├── commands/         # Command tests
└── integration/      # Integration tests
```

## Writing Tests
```javascript
describe('Service', () => {
    beforeEach(() => {
        // Setup
    });

    it('should perform operation', async () => {
        // Test implementation
    });

    afterEach(() => {
        // Cleanup
    });
});
```

## Mocking
```javascript
// Mock service example
jest.mock('../../src/services/metricCollector', () => ({
    collect: jest.fn(),
    getMetrics: jest.fn()
}));
```

## Test Data
```javascript
// fixtures/shop.json
{
    "items": [
        {
            "id": "TestItem",
            "name": "Test Item",
            "cost": 100
        }
    ]
}
```
