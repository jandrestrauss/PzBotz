import React from 'react';

const MonitoringGuide = () => {
  return (
    <div className="doc-card">
      <h3>Monitoring Guide</h3>
      <div className="content">
        <h4>System Monitoring</h4>
        <ul>
          <li>CPU Usage (Threshold: 80%)</li>
          <li>Memory Usage (Threshold: 90%)</li>
          <li>Player Count Tracking</li>
          <li>Mod Update Checks</li>
        </ul>

        <h4>Alert System</h4>
        <ul>
          <li>Discord notifications</li>
          <li>Resource usage alerts</li>
          <li>Server status changes</li>
        </ul>
      </div>
    </div>
  );
};

export default MonitoringGuide;
