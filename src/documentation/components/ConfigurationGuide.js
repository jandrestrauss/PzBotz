import React from 'react';

const ConfigurationGuide = () => {
  return (
    <div className="doc-card">
      <h3>Configuration Guide</h3>
      <div className="content">
        <h4>Environment Variables</h4>
        <pre>
          DISCORD_TOKEN=your_token_here
          RCON_PASSWORD=your_rcon_password
          RCON_PORT=27015
        </pre>

        <h4>config.json Structure</h4>
        <pre>{`
{
  "serverSettings": {
    "name": "My PZ Server",
    "rconPort": 27015
  },
  "botSettings": {
    "prefix": "!",
    "adminRoles": ["admin", "moderator"]
  }
}`}</pre>
      </div>
    </div>
  );
};

export default ConfigurationGuide;
