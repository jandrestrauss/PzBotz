const logger = require('../src/utils/logger');

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  // Reset mock state before each test
  jest.clearAllMocks();
});

// Global test utilities using globally available jest
global.mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
};
