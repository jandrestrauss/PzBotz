const BaseService = require('./BaseService');
const rconService = require('./rconService');

class ShopService extends BaseService {
    constructor() {
        super('Shop', 'shop.json');
    }

    async purchaseItem(username, itemName) {
        const item = this.data.get(itemName.toLowerCase());
        if (!item) throw new Error('Item not found');

        try {
            await rconService.execute(`additem "${username}" "${item.id}" ${item.quantity}`);
            return { success: true, item };
        } catch (error) {
            this.emit('purchaseFailed', { username, itemName, error });
            throw error;
        }
    }

    getItems() {
        return Array.from(this.data.values());
    }
}

module.exports = new ShopService();
