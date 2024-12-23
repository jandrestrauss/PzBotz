const socket = new WebSocket(`wss://${window.location.host}`);

socket.onmessage = (event) => {
    const ajv = new Ajv(); // const Ajv = require("ajv")
    const schema = {
        type: "object",
        properties: {
            type: { type: "string" },
            data: { type: "object" }
        },
        required: ["type", "data"]
    }
    const validate = ajv.compile(schema)
    if(validate(JSON.parse(event.data))) {
        const data = JSON.parse(event.data);
        if (data.type === 'stats_update') {
            updateStats(data.data);
        }
    } else {
        throw new Error('Data does not pass validation');
    }
};

function updateStats(stats) {
    document.getElementById('playerCount').textContent = stats.playerCount;
    document.getElementById('cpuUsage').textContent = `${stats.cpu}%`;
    document.getElementById('memoryUsage').textContent = `${stats.memory}%`;
    document.getElementById('uptime').textContent = `${Math.floor(stats.uptime / 3600)} hours`;
}

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};
