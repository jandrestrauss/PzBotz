import React from 'react';
import { MantineProvider } from '@mantine/core';
import { Navigation } from './Navigation';
import { ServerPanel } from './ServerPanel';
import { DiscordPanel } from './DiscordPanel';
import { ModManager } from './ModManager';
import { BackupManager } from './BackupManager';
import { SettingsPanel } from './SettingsPanel';
import { Logs } from './Logs';

export const App = () => {
    const [currentPanel, setCurrentPanel] = React.useState('server');

    const renderPanel = () => {
        switch(currentPanel) {
            case 'server': return <ServerPanel />;
            case 'discord': return <DiscordPanel />;
            case 'mods': return <ModManager />;
            case 'backup': return <BackupManager />;
            case 'settings': return <SettingsPanel />;
            case 'logs': return <Logs />;
            default: return <ServerPanel />;
        }
    };

    return (
        <MantineProvider>
            <div className="app-container">
                <Navigation onSelect={setCurrentPanel} />
                <main className="main-content">
                    {renderPanel()}
                </main>
            </div>
        </MantineProvider>
    );
};
