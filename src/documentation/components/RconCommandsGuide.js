import React from 'react';

const RconCommandsGuide = () => {
  return (
    <div className="doc-card">
      <h3>RCON Commands Guide</h3>
      <div className="content">
        <h4>Server Management</h4>
        <ul>
          <li>!servermsg [message] - Broadcast message to all players</li>
          <li>!kickuser [username] - Kick player from server</li>
          <li>!banuser [username] - Ban player from server</li>
          <li>!whitelist [add/remove] [username] - Manage whitelist</li>
        </ul>

        <h4>Server Information</h4>
        <ul>
          <li>!uptime - Show server uptime</li>
          <li>!playerlist - Show detailed player information</li>
          <li>!modlist - Show active mods</li>
        </ul>

        <h4>Server Settings</h4>
        <ul>
          <li>!saveworld - Force save the world</li>
          <li>!settime [hour] - Set in-game time</li>
          <li>!weather [type] - Change weather conditions</li>
        </ul>
      </div>
    </div>
  );
};

export default RconCommandsGuide;
