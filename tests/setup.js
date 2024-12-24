const logger = require('../src/utils/logger');

beforeAll(() => {
  // Setup test environment
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  // Cleanup test environment
});

// Global test utilities
global.mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
};
