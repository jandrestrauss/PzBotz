import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

export const useServerState = () => {
    const [status, setStatus] = useState('stopped');
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        ipcRenderer.on('server-status', (_, newStatus) => setStatus(newStatus));
        ipcRenderer.on('server-log', (_, log) => {
            setLogs(prev => [...prev, log]);
        });

        return () => {
            ipcRenderer.removeAllListeners('server-status');
            ipcRenderer.removeAllListeners('server-log');
        };
    }, []);

    const startServer = () => ipcRenderer.send('server-start');
    const stopServer = () => ipcRenderer.send('server-stop');
    const restartServer = () => ipcRenderer.send('server-restart');

    return { status, logs, startServer, stopServer, restartServer };
};
