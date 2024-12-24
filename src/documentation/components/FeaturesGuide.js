import React from 'react';

const FeaturesGuide = () => {
  return (
    <div className="doc-card">
      <h3>Features Guide</h3>
      <div className="content">
        <h4>Available Commands</h4>
        <ul>
          <li>!status - Check server status</li>
          <li>!players - List online players</li>
          <li>!restart - Restart server (Admin only)</li>
          <li>!mods - List installed mods</li>
        </ul>

        <h4>Permissions</h4>
        <ul>
          <li>Player: Basic commands</li>
          <li>Moderator: Player management</li>
          <li>Admin: Full server control</li>
        </ul>
      </div>
    </div>
  );
};

export default FeaturesGuide;
