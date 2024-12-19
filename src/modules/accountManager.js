const fs = require('fs').promises;
const path = require('path');
const cache = require('../utils/cache');

class AccountManager {
    constructor() {
        this.linkedAccounts = new Map();
        this.accountsFile = path.join(__dirname, '../../data/linked_accounts.json');
    }

    async linkAccount(discordId, steamId) {
        // Check if steamId already linked
        const existingLink = Array.from(this.linkedAccounts.values())
            .find(account => account.steamId === steamId);
        if (existingLink) {
            throw new Error('Steam ID already linked to another Discord account');
        }

        // Check if discord user already linked
        if (this.linkedAccounts.has(discordId)) {
            throw new Error('Discord account already linked');
        }

        this.linkedAccounts.set(discordId, {
            steamId,
            linkedAt: Date.now()
        });

        await this.saveAccounts();
        return true;
    }

    async unlinkAccount(discordId) {
        if (!this.linkedAccounts.has(discordId)) {
            throw new Error('Account not linked');
        }

        this.linkedAccounts.delete(discordId);
        await this.saveAccounts();
        return true;
    }

    async saveAccounts() {
        const data = JSON.stringify(Array.from(this.linkedAccounts.entries()));
        await fs.writeFile(this.accountsFile, data);
    }

    async loadAccounts() {
        try {
            const data = await fs.readFile(this.accountsFile, 'utf8');
            this.linkedAccounts = new Map(JSON.parse(data));
        } catch (error) {
            console.error('Error loading accounts:', error);
        }
    }
}