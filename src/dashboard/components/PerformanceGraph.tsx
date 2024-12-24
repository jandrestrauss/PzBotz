import React from 'react';
import { Line } from 'react-chartjs-2';
import { MetricReport } from '../../monitoring/types';

interface PerformanceGraphProps {
    data: MetricReport | null;
}

const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ data }) => {
    if (!data) return null;

    const chartData = {
        labels: [new Date(data.timestamp).toLocaleTimeString()],
        datasets: Object.entries(data.metrics).map(([key, value]) => ({
            label: key,
            data: [value],
            fill: false,
            borderColor: getLineColor(key)
        }))
    };

    return (
        <div className="performance-graph">
            <h3>Performance Metrics</h3>
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

const getLineColor = (metric: string) => {
    const colors = {
        cpu: '#2196f3',
        memory: '#4caf50',
        disk: '#ff9800',
        network: '#9c27b0'
    };
    return colors[metric as keyof typeof colors] || '#666';
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 0
    }
};

export default PerformanceGraph;
