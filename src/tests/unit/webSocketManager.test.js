const WebSocket = require('ws');
const WebSocketManager = require('../../websocket/wsManager');
const logger = require('../../utils/logger');

jest.mock('ws');
jest.mock('../../utils/logger');

describe('WebSocketManager', () => {
    let server;
    let wsManager;

    beforeEach(() => {
        server = { on: jest.fn() };
        wsManager = new WebSocketManager(server);
    });

    test('Should handle new connections', () => {
        const ws = { send: jest.fn(), on: jest.fn() };
        wsManager.handleConnection(ws);
        expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ type: 'connection', status: 'connected' }));
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
