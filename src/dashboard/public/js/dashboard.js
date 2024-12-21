class Dashboard {
    constructor() {
        this.setupWebSocket();
        this.charts = {};
        this.setupCharts();
        this.setupControls();
    }

    setupWebSocket() {
        const connect = () => {
            this.ws = new WebSocket(`ws://${window.location.host}`);

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'stats') {
                        this.updateDashboard(message.data);
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('WebSocket connection closed. Reconnecting...');
                setTimeout(connect, 5000);
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        };

        connect();
    }

    setupCharts() {
        this.charts.players = new Chart('playersChart', {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Online Players',
                    data: []
                }]
            }
        });

        this.charts.resources = new Chart('resourcesChart', {
            type: 'bar',
            data: {
                labels: ['CPU', 'Memory', 'Disk'],
                datasets: [{
                    label: 'Resource Usage',
                    data: []
                }]
            }
        });
    }

    setupControls() {
        const handleApiError = (error) => {
            console.error('API Error:', error);
            alert('An error occurred. Please try again.');
        };

        document.getElementById('restartServer').onclick = async () => {
            try {
                const response = await fetch('/api/server/restart', { method: 'POST' });
                if (!response.ok) throw new Error('Failed to restart server');
                alert('Server restart initiated');
            } catch (error) {
                handleApiError(error);
            }
        };

        document.getElementById('backupServer').onclick = async () => {
            try {
                const response = await fetch('/api/server/backup', { method: 'POST' });
                if (!response.ok) throw new Error('Failed to create backup');
                alert('Backup created successfully');
            } catch (error) {
                handleApiError(error);
            }
        };
    }

    updateDashboard(data) {
        // Update charts with new data
        this.charts.players.data.labels.push(new Date().toLocaleTimeString());
        this.charts.players.data.datasets[0].data.push(data.playerCount);
        this.charts.players.update();

        this.charts.resources.data.datasets[0].data = [
            data.cpu,
            data.memory,
            data.disk
        ];
        this.charts.resources.update();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loaded');
    new Dashboard();
});
