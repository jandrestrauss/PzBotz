import React from 'react';

const DiscordGuide = () => {
  return (
    <div className="doc-card">
      <h3>Discord Integration Guide</h3>
      <div className="content">
        <h4>Channel Setup</h4>
        <ul>
          <li>Server status channel</li>
          <li>Admin commands channel</li>
          <li>Player chat bridge</li>
          <li>Announcement channel</li>
        </ul>

        <h4>Role Management</h4>
        <ul>
          <li>Admin role setup</li>
          <li>Moderator permissions</li>
          <li>Player verification</li>
        </ul>

        <h4>Notifications</h4>
        <ul>
          <li>Server status changes</li>
          <li>Player join/leave</li>
          <li>Mod updates</li>
          <li>System alerts</li>
        </ul>
      </div>
    </div>
  );
};

export default DiscordGuide;
