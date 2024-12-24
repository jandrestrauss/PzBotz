import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useState, useEffect } from 'react';

interface PerformanceData {
  timestamp: number;
  cpuUsage: number;
  memoryUsage: number;
}

export const PerformanceGraph = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Fetch new performance data
      fetchPerformanceData().then(newData => {
        setPerformanceData(prev => [...prev.slice(-20), newData]);
      });
    }, 5000);

    return () => clearInterval(updateInterval);
  }, []);

  const chartData = {
    labels: performanceData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: performanceData.map(d => d.cpuUsage),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Memory Usage (MB)',
        data: performanceData.map(d => d.memoryUsage),
        borderColor: 'rgb(255, 99, 132)',
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

async function fetchPerformanceData(): Promise<PerformanceData> {
  // Implement actual data fetching here
  return {
    timestamp: Date.now(),
    cpuUsage: Math.random() * 100,
    memoryUsage: Math.random() * 1000
  };
}
