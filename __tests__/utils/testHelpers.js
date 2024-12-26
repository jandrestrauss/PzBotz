const createMockRcon = () => ({
    sendCommand: jest.fn().mockResolvedValue('pong'),
    connect: jest.fn().mockResolvedValue(true),
    isConnected: true
});

const createMockDiscord = (status = 0, ping = 42) => ({
    ws: {
        status,
        ping
    }
});

module.exports = {
    createMockRcon,
    createMockDiscord
};
