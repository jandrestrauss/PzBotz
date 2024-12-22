const socket = new WebSocket(`ws://${window.location.host}`);

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'stats_update') {
        updateStats(data.data);
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
