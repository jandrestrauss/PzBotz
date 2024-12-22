const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const errorMiddleware = require('../middleware/errorMiddleware');
const dashboard = require('./dashboard');
const logger = require('../utils/logger');

const app = express();
const wss = new WebSocket.Server({ noServer: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// WebSocket handling
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleWebSocketMessage(ws, data);
        } catch (error) {
            logger.error('WebSocket message error:', error);
        }
    });
});

// Routes
app.use('/dashboard', dashboard);
app.use(errorMiddleware.handleWebError);

function handleWebSocketMessage(ws, data) {
    switch(data.type) {
        case 'subscribe_stats':
            subscribeToDashboardUpdates(ws);
            break;
        case 'subscribe_logs':
            subscribeToLogs(ws);
            break;
    }
}

module.exports = { app, wss };
