const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const path = require('path');
const logger = require('./logger');

class ChartGenerator {
    constructor() {
        this.chartJSNodeCanvas = new ChartJSNodeCanvas({
            width: 800,
            height: 400,
            backgroundColour: '#ffffff'
        });
    }

    async generatePerformanceChart(data, timeframe) {
        try {
            const configuration = {
                type: 'line',
                data: {
                    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
                    datasets: [
                        {
                            label: 'CPU Usage',
                            data: data.map(d => d.cpu),
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        },
                        {
                            label: 'Memory Usage',
                            data: data.map(d => d.memory),
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            };

            return await this.chartJSNodeCanvas.renderToBuffer(configuration);
        } catch (error) {
            logger.error('Failed to generate performance chart:', error);
            throw error;
        }
    }

    async generatePlayerChart(data) {
        // Similar implementation for player count chart
    }

    async generateSystemHealthChart(data) {
        // Similar implementation for system health chart
    }
}

module.exports = new ChartGenerator();
