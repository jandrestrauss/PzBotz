class ServerMonitor {
    constructor() {
        this.charts = {};
        this.stats = {
            cpu: [],
            memory: [],
            players: []
        };
        this.maxDataPoints = 60;
        this.initializeCharts();
        this.connectWebSocket();
    }

    initializeCharts() {
        // Initialize CPU chart
        const cpuCtx = document.getElementById('cpuChart').getContext('2d');
        this.charts.cpu = new Chart(cpuCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'CPU Usage %',
                    data: [],
                    borderColor: '#FF6384',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                animation: { duration: 0 },
                scales: { y: { min: 0, max: 100 } }
            }
        });

        // Initialize Memory chart
        const memCtx = document.getElementById('memoryChart').getContext('2d');
        this.charts.memory = new Chart(memCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Memory Usage %',
                    data: [],
                    borderColor: '#36A2EB',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                animation: { duration: 0 },
                scales: { y: { min: 0, max: 100 } }
            }
        });

        // Initialize Players chart
        const playerCtx = document.getElementById('playerChart').getContext('2d');
        this.charts.players = new Chart(playerCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Players Online',
                    data: [],
                    borderColor: '#4BC0C0',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                animation: { duration: 0 },
                scales: { y: { min: 0, stepSize: 1 } }
            }
        });
    }

    connectWebSocket() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        this.ws = new WebSocket(`${wsProtocol}//${window.location.host}`);
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'serverState') {
                this.updateDashboard(data.data);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed. Reconnecting...');
            setTimeout(() => this.connectWebSocket(), 5000);
        };
    }

    updateDashboard(data) {
        // Update status indicator
        const statusIndicator = document.getElementById('statusIndicator');
        statusIndicator.className = data.status ? 'status-online' : 'status-offline';
        statusIndicator.textContent = data.status ? 'Online' : 'Offline';

        // Update charts
        const time = new Date().toLocaleTimeString();
        
        this.updateChart('cpu', time, data.stats.cpu);
        this.updateChart('memory', time, data.stats.memory);
        this.updateChart('players', time, data.players.length);

        // Update player list
        this.updatePlayerList(data.players);

        // Update mod updates notification
        if (data.modUpdates && data.modUpdates.length > 0) {
            this.showModUpdatesNotification(data.modUpdates);
        }
    }

    updateChart(chartName, label, value) {
        const chart = this.charts[chartName];
        
        chart.data.labels.push(label);
        chart.data.datasets[0].data.push(value);

        if (chart.data.labels.length > this.maxDataPoints) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }

        chart.update();
    }

    updatePlayerList(players) {
        const playerList = document.getElementById('playerList');
        playerList.innerHTML = players.map(player => `
            <div class="player-item">
                <span class="player-name">${player.name}</span>
                <span class="player-time">${this.formatPlayTime(player.playTime)}</span>
            </div>
        `).join('');
    }

    showModUpdatesNotification(updates) {
        const notification = document.getElementById('modUpdatesNotification');
        notification.innerHTML = `
            <div class="notification warning">
                <h4>Mod Updates Available</h4>
                <ul>
                    ${updates.map(mod => `<li>${mod.name} - v${mod.newVersion}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    formatPlayTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }
}

// Initialize monitor when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.serverMonitor = new ServerMonitor();
});
