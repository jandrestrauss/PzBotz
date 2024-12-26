const RconHandler = require('../src/rconHandler');

describe('RconHandler', () => {
    let rconHandler;
    const mockConfig = {
        host: 'localhost',
        port: 25575,
        password: 'test'
    };

    beforeEach(() => {
        rconHandler = new RconHandler(mockConfig);
        rconHandler.rcon = {
            send: jest.fn().mockResolvedValue('success')
        };
        rconHandler.connect = jest.fn().mockResolvedValue(true);
    });

    test('sendCommand retries on failure', async () => {
        rconHandler.rcon.send
            .mockRejectedValueOnce(new Error('Failed'))
            .mockResolvedValueOnce('success');

        const result = await rconHandler.sendCommand('test');
        expect(result).toBe('success');
        expect(rconHandler.rcon.send).toHaveBeenCalledTimes(2);
    });

    test('sendCommand throws after max retries', async () => {
        rconHandler.rcon.send.mockRejectedValue(new Error('Failed'));

        await expect(rconHandler.sendCommand('test'))
            .rejects
            .toThrow('Failed to execute command after 3 retries');
    });

    test('validates command input', async () => {
        await expect(rconHandler.sendCommand('')).rejects.toThrow('Invalid command format');
        await expect(rconHandler.sendCommand(null)).rejects.toThrow('Invalid command format');
        await expect(rconHandler.sendCommand(undefined)).rejects.toThrow('Invalid command format');
    });
});
