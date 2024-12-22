import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

export const useLogsState = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        ipcRenderer.on('logs-updated', (_, updatedLogs) => {
            setLogs(updatedLogs);
        });

        // Initial load
        ipcRenderer.send('get-logs');

        return () => {
            ipcRenderer.removeAllListeners('logs-updated');
        };
    }, []);

    return { logs };
};
