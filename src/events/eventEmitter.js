const EventEmitter = require('events');
const WebSocketHandler = require('../websocket/handler');

class GameEventEmitter extends EventEmitter {
    constructor() {
        super();
        this.wsHandler = null;
    }

    setWebSocketHandler(handler) {
        this.wsHandler = handler;
    }

    emit(event, data) {
        super.emit(event, data);
        if (this.wsHandler) {
            this.wsHandler.broadcast({
                type: event,
                payload: data,
                timestamp: Date.now()
            });
        }
    }
}

module.exports = new GameEventEmitter();
