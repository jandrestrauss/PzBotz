function validatePlayerData(player) {
    if (!player.name || typeof player.name !== 'string') {
        throw new Error('Invalid player name');
    }
    if (isNaN(player.playtime) || player.playtime < 0) {
        throw new Error('Invalid playtime');
    }
    if (isNaN(player.kills) || player.kills < 0) {
        throw new Error('Invalid kills');
    }
}

module.exports = validatePlayerData;