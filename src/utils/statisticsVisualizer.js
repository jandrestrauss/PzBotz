const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

class StatisticsVisualizer {
    constructor() {
        this.chartJSNodeCanvas = new ChartJSNodeCanvas({
            width: 800,
            height: 400,
            backgroundColour: 'white'
        });
        this.outputPath = path.join(process.cwd(), 'data', 'charts');
        this.ensureDirectoryExists();
    }

    ensureDirectoryExists() {
        if (!fs.existsSync(this.outputPath)) {
            fs.mkdirSync(this.outputPath, { recursive: true });
        }
    }

    async generateChart(data, options) {
        try {
            const configuration = {
                type: options.type || 'line',
                data: {
                    labels: data.labels,
                    datasets: data.datasets
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: options.title || 'Statistics'
                        }
                    },
                    ...options.chartOptions
                }
            };

            const buffer = await this.chartJSNodeCanvas.renderToBuffer(configuration);
            if (options.save) {
                const filename = `${options.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.png`;
                fs.writeFileSync(path.join(this.outputPath, filename), buffer);
            }
            return buffer;
        } catch (error) {
            logger.error('Failed to generate chart:', error);
            throw error;
        }
    }

    async generateServerStatsChart(stats) {
        return this.generateChart({
            labels: stats.map(s => new Date(s.timestamp).toLocaleTimeString()),
            datasets: [
                {
                    label: 'CPU Usage',
                    data: stats.map(s => s.cpu),
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false
                },
                {
                    label: 'Memory Usage',
                    data: stats.map(s => s.memory),
                    borderColor: 'rgb(255, 99, 132)',
                    fill: false
                }
            ]
        }, {
            title: 'Server Performance',
            type: 'line',
            save: true,
            chartOptions: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

module.exports = new StatisticsVisualizer();
