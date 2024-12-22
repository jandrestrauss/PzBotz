const { expect } = require('chai');
const { performance } = require('perf_hooks');
const gameEconomy = require('../integration/gameEconomy');
const serverStats = require('../models/serverStats');
const database = require('../database');

describe('Performance Tests', () => {
    before(async () => {
        await database.connect();
    });

    it('should handle concurrent player updates', async () => {
        const startTime = performance.now();
        const promises = Array(100).fill().map(() => 
            serverStats.updateStats({
                playerCount: Math.floor(Math.random() * 50),
                cpu: Math.random() * 100,
                memory: Math.random() * 100
            })
        );
        
        await Promise.all(promises);
        const endTime = performance.now();
        expect(endTime - startTime).to.be.below(1000); // Should complete within 1 second
    });

    it('should efficiently query player statistics', async () => {
        const startTime = performance.now();
        await serverStats.getOverviewStats();
        const endTime = performance.now();
        expect(endTime - startTime).to.be.below(100); // Should complete within 100ms
    });
});
