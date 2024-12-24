# Event System Guide

## Core Events
```javascript
const CORE_EVENTS = {
    SERVER: {
        START: 'serverStart',
        STOP: 'serverStop',
        CRASH: 'serverCrash'
    },
    PLAYER: {
        JOIN: 'playerJoin',
        LEAVE: 'playerLeave',
        DEATH: 'playerDeath'
    },
    SYSTEM: {
        WARNING: 'systemWarning',
        ERROR: 'systemError',
        METRIC: 'metricUpdate'
    }
};
```

## Event Handling
```javascript
// Subscribe to events
eventManager.subscribe('eventName', async (data) => {
    // Handle event
});

// Emit events
eventManager.handleEvent('eventName', eventData);
```

## Custom Events
See [Event Creation Guide](event-creation.md) for details.
