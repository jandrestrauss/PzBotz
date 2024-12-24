const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const rconService = require('./rconService');

class ShopService {
    constructor() {
        this.shopPath = path.join(process.cwd(), 'config', 'shop.json');
        this.items = new Map();
        this.loadShop();
    }

    loadShop() {
        try {
            if (fs.existsSync(this.shopPath)) {
                const items = JSON.parse(fs.readFileSync(this.shopPath, 'utf8'));
                items.forEach(item => this.items.set(item.name, item));
            }
        } catch (error) {
            logger.error('Error loading shop items:', error);
        }
    }

    async buyItem(username, itemName) {
        const item = this.items.get(itemName);
        if (!item) {
            throw new Error('Item not found');
        }

        try {
            await rconService.execute(`additem "${username}" "${item.id}" ${item.quantity}`);
            return true;
        } catch (error) {
            logger.error(`Failed to give item to ${username}:`, error);
            throw error;
        }
    }

    getItems() {
        return Array.from(this.items.values());
    }
}

module.exports = new ShopService();
