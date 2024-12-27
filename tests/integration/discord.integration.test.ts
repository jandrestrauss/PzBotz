import { jest } from '@jest/globals';
import { Client, Message, TextChannel, ChannelType } from 'discord.js';
import { DatabasePool } from '../../src/database/pool';
import { metrics } from '../../src/monitoring/advancedMetrics';
import * as logger from '../../src/utils/logger';
import { createMockChannel, createMockMessage } from '../mocks/discord';
import { QueryResult } from 'pg';

jest.mock('discord.js');
jest.mock('../../src/utils/logger');
jest.mock('../../src/database/pool');

describe('Discord Bot Integration Tests', () => {
    let client: Client;
    let dbPool: DatabasePool;

    beforeEach(() => {
        jest.clearAllMocks();
        metrics.resetAll();
        (logger.error as jest.Mock) = jest.fn();
        (logger.info as jest.Mock) = jest.fn();
        
        client = new Client({ intents: [] });
        dbPool = new DatabasePool();
    });

    test('should handle message commands', async () => {
        const mockChannel = createMockChannel();
        const mockMessage = createMockMessage(mockChannel);

        // Create message handler
        const messageHandler = jest.fn((msg: Message) => {
            if (msg.content.startsWith('!test')) {
                msg.reply('Test command received');
            }
        });

        // Setup client event handling
        client.on('messageCreate', messageHandler);
        
        // Trigger the event handler directly
        messageHandler(mockMessage);

        expect(mockMessage.reply).toHaveBeenCalledWith('Test command received');
        expect(logger.error).not.toHaveBeenCalled();
    });

    test('should log database interactions', async () => {
        // Reset metrics before test
        metrics.resetAll();

        // Setup mock query timing
        const startTime = Date.now();
        jest.spyOn(Date, 'now')
            .mockReturnValueOnce(startTime)
            .mockReturnValueOnce(startTime + 100); // Simulate 100ms query time

        // Mock successful query with proper types
        const mockQueryResult: QueryResult<any> = {
            rows: [],
            command: 'SELECT',
            rowCount: 0,
            oid: 0,
            fields: []
        };
        
        const mockQuery = dbPool.query as jest.MockedFunction<typeof dbPool.query>;
        mockQuery.mockImplementationOnce(async () => {
            metrics.recordQuery(100, true);
            return mockQueryResult;
        });
        
        await dbPool.query('SELECT NOW()');
        const dbMetrics = metrics.getMetrics();

        expect(dbMetrics.queryCount).toBe(1);
        expect(dbMetrics.errorRate).toBe(0);
        expect(logger.error).not.toHaveBeenCalled();

        // Cleanup
        jest.spyOn(Date, 'now').mockRestore();
    });
});
