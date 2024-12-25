class Dashboard {
    constructor() {
        this.charts = {};
        this.ws = null;
        this.init();
    }

    init() {
        this.setupWebSocket();
        this.initializeCharts();
        this.setupRefreshHandlers();
    }

    setupWebSocket() {
        this.ws = new WebSocket(`ws://${window.location.host}`);
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.updateMetrics(data);
        };

        this.ws.onclose = () => {
            setTimeout(() => this.setupWebSocket(), 5000);
        };
    }

    initializeCharts() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'CPU Usage',
                        data: [],
                        borderColor: 'rgb(75, 192, 192)'
                    },
                    {
                        label: 'Memory Usage',
                        data: [],
                        borderColor: 'rgb(255, 99, 132)'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    updateMetrics(data) {
        if (data.type === 'metrics') {
            this.updateCharts(data.data);
            this.updateCards(data.data);
        }
    }
}

new Dashboard();
