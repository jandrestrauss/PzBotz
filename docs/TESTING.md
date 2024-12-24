# Testing Guide

## Setup Testing Environment
```bash
# Install dev dependencies
npm install --save-dev jest @types/jest

# Configure test environment
cp .env.example .env.test
```

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
npm test -- services/points

# Watch mode
npm test -- --watch

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

### Test Environment Setup
```bash
# Install test dependencies
npm install -g ngrok jest newman

# Start local test server
npm run test:server

# Start ngrok tunnel
ngrok http 3000
```

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

### Automated Test Suites

#### Unit Tests
```bash
# Run all unit tests
npm run test:unit

# Run payment specific tests
npm run test:unit:payment

# Run webhook tests
npm run test:unit:webhook
```

#### Integration Tests
```bash
# Run API integration tests
npm run test:integration

# Run payment flow tests
npm run test:integration:payment

# With coverage
npm run test:integration -- --coverage
```

#### End-to-End Tests
```bash
# Run full E2E test suite
npm run test:e2e

# Run payment scenarios
npm run test:e2e:payment
```

### Test Scenarios

#### Payment Processing
1. Successful Payment
   - Valid card
   - Sufficient funds
   - Valid OTP
   
2. Failed Payment
   - Invalid card
   - Insufficient funds
   - Wrong OTP
   - Network timeout

3. Webhook Processing
   - Valid signature
   - Invalid signature
   - Retry mechanism
   - Timeout handling

### Test Data

#### Success Scenarios
```json
{
  "card": "4084084084084081",
  "cvv": "408",
  "expiry": "12/25",
  "pin": "0000",
  "otp": "123456"
}
```

#### Failure Scenarios
```json
{
  "invalidCard": "4084084084084082",
  "wrongOtp": "222666",
  "invalidPin": "1234"
}
```

## Test Scenarios
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

# Testing

## Test Coverage Requirements
- Unit tests: 80%
- Integration tests: 70%

## Running Tests
```bash
npm run test:unit        # Unit tests
npm run test:integration # Integration tests 
npm run test:e2e         # End-to-end tests
```

## Performance Testing
Ensure that performance tests are conducted to monitor memory usage and response times. Use the `MonitorPerformance` method in `PerformanceOptimizationService` to log performance metrics.

## Detailed Performance Metrics Testing
Ensure that detailed performance metrics are logged, including CPU usage, memory usage, and disk I/O. Use the `LogDetailedPerformanceMetrics` method in `PerformanceOptimizationService` to log these metrics.

## Test Structure
```typescript
// Example test structure
describe('PointsService', () => {
  beforeEach(() => {
    // Setup
  });

  it('should add points correctly', async () => {
    // Test
  });

  afterEach(() => {
    // Cleanup
  });
});
```

## Mocking
```typescript
// Example mocks
jest.mock('../services/rconService');
jest.mock('../utils/logger');

// Mock implementation
const mockRcon = {
  execute: jest.fn()
};
```
