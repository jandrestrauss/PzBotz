const validator = require('../../core/validation');
const { AppError } = require('../../utils/errorHandler');

describe('Configuration Validation', () => {
    describe('Server Config Validation', () => {
        test('Should validate correct server config', () => {
            const config = {
                serverName: 'Test Server',
                maxPlayers: 32,
                adminPassword: 'password123'
            };

            expect(() => validator.validateServerConfig(config)).not.toThrow();
        });

        test('Should reject invalid player count', () => {
            const config = {
                serverName: 'Test Server',
                maxPlayers: 0,
                adminPassword: 'password123'
            };

            expect(() => validator.validateServerConfig(config))
                .toThrow(AppError);
        });

        test('Should reject missing server name', () => {
            const config = {
                maxPlayers: 32,
                adminPassword: 'password123'
            };

            expect(() => validator.validateServerConfig(config))
                .toThrow(AppError);
        });

        test('Should reject missing admin password', () => {
            const config = {
                serverName: 'Test Server',
                maxPlayers: 32
            };

            expect(() => validator.validateServerConfig(config))
                .toThrow(AppError);
        });
    });
});
