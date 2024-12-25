class AdvancedGraphs {
    constructor() {
        this.charts = new Map();
        this.options = {
            animation: false,
            responsive: true,
            plugins: {
                decimation: {
                    enabled: true,
                    algorithm: 'min-max'
                }
            },
            scales: {
                x: { type: 'time', time: { unit: 'minute' } }
            }
        };
        this.setupGraphs();
    }

    setupGraphs() {
        this.createPerformanceGraph();
        this.createPlayerGraph();
        this.createResourceGraph();
        this.startRealTimeUpdates();
    }

    createPerformanceGraph() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        this.charts.set('performance', new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'CPU',
                        borderColor: '#2ecc71',
                        data: []
                    },
                    {
                        label: 'Memory',
                        borderColor: '#e74c3c',
                        data: []
                    }
                ]
            },
            options: {
                ...this.options,
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        }));
    }

    updateGraph(name, data) {
        const chart = this.charts.get(name);
        if (!chart) return;

        // Update with smooth animation
        chart.data.datasets.forEach((dataset, i) => {
            dataset.data.push({
                x: Date.now(),
                y: data[i]
            });

            // Keep last hour of data
            const hourAgo = Date.now() - 3600000;
            dataset.data = dataset.data.filter(point => point.x > hourAgo);
        });

        chart.update('none');
    }
}
