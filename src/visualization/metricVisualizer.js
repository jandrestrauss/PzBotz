const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');

class MetricVisualizer {
    constructor() {
        this.chartGenerator = new ChartJSNodeCanvas({
            width: 800,
            height: 400,
            backgroundColor: 'white'
        });
        this.outputPath = path.join(process.cwd(), 'data', 'charts');
        this.initialize();
    }

    async initialize() {
        await fs.mkdir(this.outputPath, { recursive: true });
    }

    async generatePerformanceChart(metrics, timeRange = '24h') {
        const config = {
            type: 'line',
            data: {
                labels: metrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
                datasets: [
                    {
                        label: 'CPU Usage',
                        data: metrics.map(m => m.cpu),
                        borderColor: 'rgb(75, 192, 192)'
                    },
                    {
                        label: 'Memory Usage',
                        data: metrics.map(m => m.memory.usedPercent),
                        borderColor: 'rgb(255, 99, 132)'
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

        return await this.chartGenerator.renderToBuffer(config);
    }

    async saveChart(buffer, name) {
        const filename = `${name}-${Date.now()}.png`;
        await fs.writeFile(path.join(this.outputPath, filename), buffer);
        return filename;
    }
}

module.exports = new MetricVisualizer();
