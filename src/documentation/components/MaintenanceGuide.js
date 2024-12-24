import React from 'react';

const MaintenanceGuide = () => {
  return (
    <div className="doc-card">
      <h3>Server Maintenance Guide</h3>
      <div className="content">
        <h4>Regular Maintenance</h4>
        <ul>
          <li>Daily automated restarts</li>
          <li>World backup schedule</li>
          <li>Log rotation</li>
          <li>Performance monitoring</li>
        </ul>

        <h4>Backup System</h4>
        <ul>
          <li>Automatic backups every 4 hours</li>
          <li>Backup location: ./backups/</li>
          <li>Backup retention: 7 days</li>
        </ul>

        <h4>Emergency Procedures</h4>
        <ul>
          <li>Server crash recovery</li>
          <li>Backup restoration</li>
          <li>Emergency shutdown protocol</li>
        </ul>
      </div>
    </div>
  );
};

export default MaintenanceGuide;
