class RealtimeGraphs {
    constructor() {
        this.dataPoints = 60; // 1 hour of data at 1-minute intervals
        this.datasets = new Map();
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.ws = new WebSocket(`ws://${window.location.host}/metrics`);
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMetricUpdate(data);
        };

        this.ws.onclose = () => {
            setTimeout(() => this.setupWebSocket(), 5000);
        };
    }

    handleMetricUpdate(data) {
        const timestamp = new Date(data.timestamp).toLocaleTimeString();
        
        Object.entries(data.metrics).forEach(([key, value]) => {
            if (!this.datasets.has(key)) {
                this.datasets.set(key, {
                    labels: [],
                    data: []
                });
            }

            const dataset = this.datasets.get(key);
            dataset.labels.push(timestamp);
            dataset.data.push(value);

            // Keep only last 60 data points
            if (dataset.labels.length > this.dataPoints) {
                dataset.labels.shift();
                dataset.data.shift();
            }

            this.updateChart(key, dataset);
        });
    }

    updateChart(metricName, dataset) {
        const chart = window.dashboardCharts[metricName];
        if (chart) {
            chart.data.labels = dataset.labels;
            chart.data.datasets[0].data = dataset.data;
            chart.update('none'); // Update without animation
        }
    }
}
