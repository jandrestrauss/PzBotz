import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

export const useDiscordBot = () => {
    const [status, setStatus] = useState('stopped');
    const [settings, setSettings] = useState({
        token: '',
        prefix: '!',
        adminRoles: []
    });
    const [commandLogs, setCommandLogs] = useState([]);

    useEffect(() => {
        ipcRenderer.on('discord-status', (_, newStatus) => setStatus(newStatus));
        ipcRenderer.on('discord-log', (_, log) => {
            setCommandLogs(prev => [...prev, log]);
        });

        // Load initial settings
        ipcRenderer.send('get-discord-settings');
        ipcRenderer.on('discord-settings', (_, settings) => setSettings(settings));

        return () => {
            ipcRenderer.removeAllListeners('discord-status');
            ipcRenderer.removeAllListeners('discord-log');
            ipcRenderer.removeAllListeners('discord-settings');
        };
    }, []);

    const toggleBot = () => {
        ipcRenderer.send(status === 'running' ? 'stop-bot' : 'start-bot');
    };

    const updateSettings = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        ipcRenderer.send('update-discord-settings', newSettings);
    };

    return { status, settings, updateSettings, toggleBot, commandLogs };
};
