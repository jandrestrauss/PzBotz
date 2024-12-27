const serverManager = require('../serverManager');

describe('Server Manager', () => {
  test('should execute RCON command', async () => {
    const command = 'your_rcon_command';
    const result = await serverManager.executeRconCommand(command);
    expect(result).toBe('expected_result'); // Adjust the expected value based on your setup
  });
});
