import React from 'react';

const PerformanceGuide = () => {
  return (
    <div className="doc-card">
      <h3>Performance Monitoring Guide</h3>
      <div className="content">
        <h4>Metrics Tracked</h4>
        <ul>
          <li>TPS (Ticks Per Second)</li>
          <li>Memory usage</li>
          <li>CPU utilization</li>
          <li>Network latency</li>
        </ul>

        <h4>Alert Thresholds</h4>
        <ul>
          <li>TPS below 20</li>
          <li>Memory above 90%</li>
          <li>CPU above 80%</li>
          <li>Latency above 100ms</li>
        </ul>

        <h4>Performance Reports</h4>
        <ul>
          <li>Daily summaries</li>
          <li>Weekly trends</li>
          <li>Performance logs</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceGuide;
