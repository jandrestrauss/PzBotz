const fs = require('fs').promises;
const path = require('path');
const { AppError } = require('../utils/errorHandler');

class PluginManager {
    constructor() {
        this.plugins = new Map();
        this.pluginDir = path.join(__dirname, 'available');
    }

    async loadPlugins() {
        const files = await fs.readdir(this.pluginDir);
        
        for (const file of files) {
            if (file.endsWith('.js')) {
                try {
                    const plugin = require(path.join(this.pluginDir, file));
                    if (this.validatePlugin(plugin)) {
                        await this.enablePlugin(plugin);
                    }
                } catch (error) {
                    console.error(`Failed to load plugin ${file}:`, error);
                }
            }
        }
    }

    validatePlugin(plugin) {
        return plugin.name && 
               plugin.version && 
               typeof plugin.initialize === 'function';
    }

    async enablePlugin(plugin) {
        try {
            await plugin.initialize();
            this.plugins.set(plugin.name, plugin);
        } catch (error) {
            throw new AppError(`Plugin ${plugin.name} failed to initialize`, 500);
        }
    }
}

module.exports = new PluginManager();
