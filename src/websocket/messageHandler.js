const handleMessage = async (message, ws) => {
    try {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'SERVER_STATS':
                await handleServerStats(data.payload);
                break;
            case 'PLAYER_ACTION':
                await handlePlayerAction(data.payload);
                break;
            default:
                console.warn('Unknown message type:', data.type);
        }
    } catch (error) {
        console.error('Message handling error:', error);
    }
};

module.exports = { handleMessage };
