import React from 'react';
import ConfigurationGuide from '../../documentation/components/ConfigurationGuide';
import InstallationGuide from '../../documentation/components/InstallationGuide';
import FeaturesGuide from '../../documentation/components/FeaturesGuide';
import RconCommandsGuide from '../../documentation/components/RconCommandsGuide';
import MaintenanceGuide from '../../documentation/components/MaintenanceGuide';
import ModManagementGuide from '../../documentation/components/ModManagementGuide';
import DiscordGuide from '../../documentation/components/DiscordGuide';
import PerformanceGuide from '../../documentation/components/PerformanceGuide';
import MonitoringGuide from '../../documentation/components/MonitoringGuide';
import TroubleshootingGuide from '../../documentation/components/TroubleshootingGuide';

const Documentation = () => {
  return (
    <div className="documentation">
      <div className="docs-list">
        <ConfigurationGuide />
        <InstallationGuide />
        <FeaturesGuide />
        <RconCommandsGuide />
        <MaintenanceGuide />
        <ModManagementGuide />
        <DiscordGuide />
        <PerformanceGuide />
        <MonitoringGuide />
        <TroubleshootingGuide />
      </div>
    </div>
  );
};

export default Documentation;
