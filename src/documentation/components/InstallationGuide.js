import React from 'react';

const InstallationGuide = () => {
  return (
    <div className="doc-card">
      <h3>Installation Guide</h3>
      <div className="content">
        <h4>Requirements</h4>
        <ul>
          <li>Node.js 16.x or higher</li>
          <li>Project Zomboid Server</li>
          <li>Discord Bot Token</li>
        </ul>

        <h4>Setup Steps</h4>
        <ol>
          <li>Clone the repository</li>
          <li>Run npm install</li>
          <li>Create .env file</li>
          <li>Configure config.json</li>
          <li>Start with: npm start</li>
        </ol>
      </div>
    </div>
  );
};

export default InstallationGuide;
