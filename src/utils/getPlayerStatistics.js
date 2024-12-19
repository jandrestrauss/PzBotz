const fs = require('fs').promises;
const path = require('path');
const validatePlayerData = require('./validateData');

async function getPlayerStatistics() {
    try {
        const modDataFilePath = path.join(__dirname, '../../data/mod_data.bin');
        const modData = await fs.readFile(modDataFilePath, 'utf8');

        const players = modData.split('\n')
            .filter(line => line.includes('Player'))
            .map(line => {
                const [name, playtime, kills] = line.split(',');
                const player = {
                    name: name.trim(),
                    playtime: parseInt(playtime.trim(), 10),
                    kills: parseInt(kills.trim(), 10)
                };
                validatePlayerData(player);
                return player;
            });

        let totalPlaytime = 0;
        let totalKills = 0;

        players.forEach(player => {
            totalPlaytime += player.playtime;
            totalKills += player.kills;
        });

        return {
            totalPlaytime: (totalPlaytime / 3600).toFixed(2), // Convert seconds to hours
            totalKills,
            players
        };
    } catch (error) {
        console.error('Error fetching player statistics:', error);
        return {
            totalPlaytime: 0,
            totalKills: 0,
            players: []
        };
    }
}

module.exports = getPlayerStatistics;