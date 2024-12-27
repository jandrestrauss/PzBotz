const assert = require('assert');
const { expect } = require('chai');
const ServerManager = require('../serverManager');
const config = require('./config');

describe('Server Tests', () => {
  before(() => {
    // Setup code that runs before all tests
    // Example: Initialize database connection
  });

  after(() => {
    // Cleanup code that runs after all tests
    // Example: Close database connection
  });

  it('should connect to RCON server', async () => {
    const serverManager = new ServerManager(config.testConfig);
    const isConnected = await serverManager.connectRcon();
    expect(isConnected).to.be.true;
  });

  it('should handle player commands', async () => {
    const serverManager = new ServerManager(config.testConfig);
    const result = await serverManager.executeRconCommand('players');
    expect(result).to.be.a('string');
  });
});

describe('Server Manager Tests', () => {
  let serverManager;

  beforeEach(() => {
    serverManager = new ServerManager(config.testConfig);
  });

  test('should check server status', async () => {
    const status = await serverManager.isServerRunning();
    expect(typeof status).toBe('boolean');
  });

  test('should execute RCON command', async () => {
    const result = await serverManager.executeRconCommand('players');
    expect(result).toBeDefined();
  });
});
