import React from 'react';

const TroubleshootingGuide = () => {
  return (
    <div className="doc-card">
      <h3>Troubleshooting Guide</h3>
      <div className="content">
        <h4>Common Issues</h4>
        <ul>
          <li>
            <strong>Bot not connecting:</strong>
            Check Discord token in .env
          </li>
          <li>
            <strong>RCON errors:</strong>
            Verify RCON password and port
          </li>
          <li>
            <strong>Command not responding:</strong>
            Check permissions and roles
          </li>
        </ul>

        <h4>Support</h4>
        <p>For issues, create a ticket in Discord or check the logs in ./logs folder</p>
      </div>
    </div>
  );
};

export default TroubleshootingGuide;
