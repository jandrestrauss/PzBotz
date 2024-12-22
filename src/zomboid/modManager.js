const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class ModManager {
    constructor() {
        this.modsPath = process.env.ZOMBOID_MODS_PATH;
        this.workshopPath = process.env.WORKSHOP_PATH;
        this.serverConfig = path.join(process.env.ZOMBOID_SERVER_PATH, 'servertest.ini');
    }

    async getInstalledMods() {
        const modsDir = await fs.readdir(this.modsPath);
        return Promise.all(modsDir
            .filter(dir => dir.startsWith('mod_'))
            .map(async dir => {
                const modInfo = await this.readModInfo(dir);
                return {
                    id: dir.replace('mod_', ''),
                    ...modInfo,
                    isEnabled: await this.isModEnabled(dir)
                };
            }));
    }

    async toggleMod(modId, enable) {
        const config = await this.readServerConfig();
        const modLine = `Mods=${modId}`;
        
        if (enable && !config.includes(modLine)) {
            await fs.appendFile(this.serverConfig, `\n${modLine}`);
        } else if (!enable) {
            const newConfig = config.split('\n').filter(line => !line.includes(modId)).join('\n');
            await fs.writeFile(this.serverConfig, newConfig);
        }
    }

    async updateMods() {
        const stopTimer = PerformanceMonitor.startTimer('modUpdate');
        try {
            const installedMods = await this.getInstalledMods();
            const updates = await this.checkModUpdates(installedMods);
            
            if (updates.length > 0) {
                logger.logEvent(`Updating ${updates.length} mods`);
                await this.downloadModUpdates(updates);
                return true;
            }
            return false;
        } finally {
            stopTimer();
        }
    }

    async validateMods() {
        const modConfig = await this.readModConfig();
        const missingMods = [];
        
        for (const modId of modConfig.requiredMods) {
            if (!await this.isModInstalled(modId)) {
                missingMods.push(modId);
            }
        }
        
        return missingMods;
    }
}

module.exports = new ModManager();
