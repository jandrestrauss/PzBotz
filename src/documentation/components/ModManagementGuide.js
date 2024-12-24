import React from 'react';

const ModManagementGuide = () => {
  return (
    <div className="doc-card">
      <h3>Mod Management Guide</h3>
      <div className="content">
        <h4>Workshop Mods</h4>
        <ul>
          <li>Auto-update configuration</li>
          <li>Required mod list</li>
          <li>Mod load order</li>
        </ul>

        <h4>Mod Commands</h4>
        <ul>
          <li>!checkupdates - Check for mod updates</li>
          <li>!updatemod [modID] - Update specific mod</li>
          <li>!modstatus - Show mod status</li>
        </ul>

        <h4>Troubleshooting</h4>
        <ul>
          <li>Mod conflict resolution</li>
          <li>Missing dependency handling</li>
          <li>Workshop connection issues</li>
        </ul>
      </div>
    </div>
  );
};

export default ModManagementGuide;
