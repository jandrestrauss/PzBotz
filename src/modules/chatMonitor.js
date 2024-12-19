const rcon = require('../utils/rcon');
const linkingManager = require('./linkingManager');

class ChatMonitor {
    async processChat(line) {
        // Example chat format: "Player123: !link ABC123"
        const match = line.match(/^(.+?):\s+(.+)$/);
        if (!match) return;

        const [, playerName, message] = match;
        if (message.startsWith('!link')) {
            const result = await linkingManager.handleIngameMessage(playerName, message);
            if (result) {
                await rcon.sendCommand(`servermsg "${result}"`);
            }
        }
    }
}

module.exports = new ChatMonitor();