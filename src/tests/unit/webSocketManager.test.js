const { describe, test, expect, beforeEach, jest } = require('@jest/globals');
const WebSocketManager = require('../../services/webSocketManager');
const logger = require('../../utils/logger');

jest.mock('ws');
jest.mock('../../utils/logger');

describe('WebSocketManager', () => {
    let wsManager;

    beforeEach(() => {
        wsManager = new WebSocketManager();
    });

    test('should initialize correctly', () => {
        expect(wsManager).toBeDefined();
        expect(wsManager.connections).toEqual(new Set());
    });

    test('should handle new connections', () => {
        const mockSocket = {
            on: jest.fn(),
            send: jest.fn()
        };

        wsManager.handleConnection(mockSocket);
        expect(wsManager.connections.size).toBe(1);
    });

    test('Should handle disconnections', () => {
        const ws = { send: jest.fn(), on: jest.fn() };
        wsManager.handleConnection(ws);
        wsManager.handleDisconnection(ws);
        expect(wsManager.clients.has(ws)).toBe(false);
    });

    test('Should broadcast messages', () => {
        const ws = { send: jest.fn(), readyState: WebSocket.OPEN };
        wsManager.clients.add(ws);
        wsManager.broadcast('test', { message: 'test' });
        expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ type: 'test', data: { message: 'test' } }));
    });

    test('Should handle messages', () => {
        const ws = { send: jest.fn(), on: jest.fn() };
        wsManager.handleMessage(ws, JSON.stringify({ type: 'test', data: 'test' }));
        expect(logger.logEvent).not.toHaveBeenCalled();
    });

    test('Should handle message errors', () => {
        const ws = { send: jest.fn(), on: jest.fn() };
        wsManager.handleMessage(ws, 'invalid json');
        expect(logger.logEvent).toHaveBeenCalledWith(expect.stringContaining('WebSocket error'));
    });
});
