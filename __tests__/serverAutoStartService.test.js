const serverAutoStartService = require('../serverAutoStartService');

describe('Server Auto Start Service', () => {
  test('should check if server is running', async () => {
    const isRunning = await serverAutoStartService.isServerRunning();
    expect(isRunning).toBe(true); // Adjust the expected value based on your setup
  });

  test('should start the server', async () => {
    await serverAutoStartService.startServer();
    const isRunning = await serverAutoStartService.isServerRunning();
    expect(isRunning).toBe(true);
  });
});
