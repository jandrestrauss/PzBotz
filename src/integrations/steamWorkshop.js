const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAM_API_KEY);
const gameEvents = require('../events/eventEmitter');

class WorkshopManager {
    constructor() {
        this.workshopItems = new Map();
        this.updateInterval = 3600000; // 1 hour
    }

    async initialize() {
        await this.updateWorkshopItems();
        setInterval(() => this.updateWorkshopItems(), this.updateInterval);
    }

    async updateWorkshopItems() {
        try {
            const items = await steam.getWorkshopFiles(process.env.GAME_ID);
            items.forEach(item => this.workshopItems.set(item.id, item));
            gameEvents.emit('workshopUpdate', Array.from(this.workshopItems.values()));
        } catch (error) {
            console.error('Workshop update failed:', error);
        }
    }
}

module.exports = new WorkshopManager();
