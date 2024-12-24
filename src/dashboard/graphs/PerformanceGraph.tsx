import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useState, useEffect } from 'react';
import { MetricReport } from '../../monitoring/types';

interface Props {
  data?: MetricReport | null;
}

export const PerformanceGraph: React.FC<Props> = ({ data }) => {
  const [performanceData, setPerformanceData] = useState<MetricReport[]>([]);

  useEffect(() => {
    if (data) {
      setPerformanceData(prev => [...prev.slice(-20), data]);
    }
  }, [data]);

  const chartData = {
    labels: performanceData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: performanceData.map(d => d.metrics.cpu),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Memory Usage (%)',
        data: performanceData.map(d => d.metrics.memory),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Disk Usage (%)',
        data: performanceData.map(d => d.metrics.disk),
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="performance-graph">
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  );
};
