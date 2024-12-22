import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

export const useAdminState = () => {
    const [users, setUsers] = useState([]);
    const [serverConfig, setServerConfig] = useState({});
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        ipcRenderer.on('admin-data-updated', (_, data) => {
            if (data.users) setUsers(data.users);
            if (data.config) setServerConfig(data.config);
            if (data.logs) setLogs(prev => [...prev, ...data.logs]);
        });

        // Initial load
        ipcRenderer.send('get-admin-data');

        return () => {
            ipcRenderer.removeAllListeners('admin-data-updated');
        };
    }, []);

    const updateServerConfig = async (config) => {
        await ipcRenderer.invoke('update-server-config', config);
    };

    const updateUserRole = async (userId, role) => {
        await ipcRenderer.invoke('update-user-role', { userId, role });
    };

    return {
        users,
        serverConfig,
        logs,
        updateServerConfig,
        updateUserRole
    };
};
