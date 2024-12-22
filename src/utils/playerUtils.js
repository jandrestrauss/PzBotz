const database = require('../database');

class PlayerUtils {
    constructor() {
        this.setupDatabase();
    }

    async setupDatabase() {
        this.PlayerLinks = database.sequelize.define('PlayerLinks', {
            discordId: {
                type: database.Sequelize.STRING,
                primaryKey: true
            },
            steamId: {
                type: database.Sequelize.STRING,
                unique: true
            },
            verifiedAt: database.Sequelize.DATE
        });

        await this.PlayerLinks.sync();
    }

    async getSteamId(discordId) {
        const link = await this.PlayerLinks.findByPk(discordId);
        return link?.steamId || null;
    }

    async linkAccount(discordId, steamId) {
        try {
            await this.PlayerLinks.upsert({
                discordId,
                steamId,
                verifiedAt: new Date()
            });
            return true;
        } catch (error) {
            logger.error('Failed to link account:', error);
            return false;
        }
    }
}

module.exports = new PlayerUtils();
