const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
const logger = require('../utils/logger');

class ModManager {
    constructor() {
        this.modsPath = process.env.MODS_PATH;
        this.modList = new Map();
    }

    async checkForUpdates() {
        try {
            const mods = await this.loadInstalledMods();
            const updates = [];

            for (const [id, mod] of mods) {
                const hasUpdate = await this.checkModUpdate(id, mod.version);
                if (hasUpdate) updates.push(id);
            }

            if (updates.length > 0) {
                logger.info(`Updates available for mods: ${updates.join(', ')}`);
                await this.updateMods(updates);
            }
        } catch (error) {
            logger.error('Failed to check for mod updates:', error);
        }
    }

    async updateMods(modIds) {
        for (const id of modIds) {
            try {
                await this.downloadModUpdate(id);
                logger.info(`Updated mod: ${id}`);
            } catch (error) {
                logger.error(`Failed to update mod ${id}:`, error);
            }
        }
    }
}

module.exports = new ModManager();
