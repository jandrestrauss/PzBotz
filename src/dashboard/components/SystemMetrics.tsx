import React from 'react';
import { MetricReport } from '../../monitoring/types';

interface SystemMetricsProps {
  data?: MetricReport['metrics'];
}

const SystemMetrics: React.FC<SystemMetricsProps> = ({ data }) => {
  if (!data) return <div>Loading metrics...</div>;

  return (
    <div className="system-metrics">
      <h3>System Metrics</h3>
      <div className="metrics-grid">
        <div className="metric-item">
          <label>CPU Usage:</label>
          <span className={data.cpu > 80 ? 'alert' : ''}>
            {data.cpu.toFixed(1)}%
          </span>
        </div>
        <div className="metric-item">
          <label>Memory Usage:</label>
          <span className={data.memory > 90 ? 'alert' : ''}>
            {data.memory.toFixed(1)}%
          </span>
        </div>
        <div className="metric-item">
          <label>Disk Usage:</label>
          <span className={data.disk > 90 ? 'alert' : ''}>
            {data.disk.toFixed(1)}%
          </span>
        </div>
        <div className="metric-item">
          <label>Players Online:</label>
          <span>{data.players}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemMetrics;
