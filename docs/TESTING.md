# Testing Guide

## Test Structure
```
/tests
├── unit/               # Unit tests
├── integration/        # Integration tests
├── e2e/               # End-to-end tests
└── mocks/             # Test mocks
```

## Running Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## Writing Tests

### Unit Tests
```javascript
describe('ModuleX', () => {
    test('should perform specific action', () => {
        // Test implementation
    });
});
```

### Integration Tests
```javascript
describe('API Integration', () => {
    beforeAll(async () => {
        // Setup test environment
    });

    afterAll(async () => {
        // Cleanup
    });
});
```

## Payment Integration Tests

### Paystack Test Environment
- Environment: `Test Mode`
- Status: `Active`
- API Access: `Enabled`

### Test Cards
```
# Successful Transaction
Card Number: 4084084084084081
CVV: 408
Expiry: 12/25
PIN: 0000
OTP: 123456

# Failed Transaction
Card Number: 4084084084084081
CVV: 408
Expiry: 12/25
PIN: 0000
OTP: 222666
```

### Webhook Testing
1. Install ngrok: `npm install -g ngrok`
2. Start tunnel: `ngrok http 3000`
3. Configure webhook URL in Paystack dashboard
4. Test endpoint: `curl -X POST http://localhost:3000/webhook/paystack`

### Test Scenarios
1. Successful Payment Flow
2. Failed Payment
3. Timeout Handling
4. Invalid Card
5. Network Error
6. Webhook Processing

## Automated Tests
```bash
# Run payment integration tests
npm run test:payment

# Run specific test suite
npm run test:paystack

# Generate test coverage
npm run test:coverage
```

## Test Coverage Requirements
- Unit Tests: 80%
- Integration Tests: 70%
- E2E Tests: Key user flows

## Mocking Guidelines
1. External APIs
2. Database Connections
3. File System Operations
4. Discord API Calls
