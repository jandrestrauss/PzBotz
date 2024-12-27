const { expect } = require('chai');
const BaseService = require('../../src/services/BaseService');
const fs = require('fs');
const path = require('path');

describe('BaseService', () => {
    let service;

    beforeEach(() => {
        service = new BaseService('testService', 'test-config.json');
    });

    describe('initialization', () => {
        it('should create instance with correct name', () => {
            expect(service.name).to.equal('testService');
        });

        it('should initialize with empty data map', () => {
            expect(service.data).to.be.instanceOf(Map);
            expect(service.data.size).to.equal(0);
        });
    });

    describe('loadConfig', () => {
        it('should load configuration from file', async () => {
            // Create temporary test config
            const testConfig = {
                testKey: 'testValue'
            };
            
            fs.writeFileSync(
                path.join(process.cwd(), 'config', 'test-config.json'),
                JSON.stringify(testConfig)
            );

            await service.loadConfig();
            expect(service.data.get('testKey')).to.equal('testValue');

            // Cleanup
            fs.unlinkSync(path.join(process.cwd(), 'config', 'test-config.json'));
        });
    });
});
