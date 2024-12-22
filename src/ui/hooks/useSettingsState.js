import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

export const useSettingsState = () => {
    const [settings, setSettings] = useState({
        serverPath: '',
        adminPassword: '',
        rconPassword: ''
    });

    useEffect(() => {
        ipcRenderer.on('settings-updated', (_, updatedSettings) => {
            setSettings(updatedSettings);
        });

        // Initial load
        ipcRenderer.send('get-settings');

        return () => {
            ipcRenderer.removeAllListeners('settings-updated');
        };
    }, []);

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const saveSettings = async () => {
        await ipcRenderer.invoke('save-settings', settings);
    };

    return { settings, updateSetting, saveSettings };
};
