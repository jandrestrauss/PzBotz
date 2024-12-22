import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

export const useBackupState = () => {
    const [backups, setBackups] = useState([]);

    useEffect(() => {
        ipcRenderer.on('backups-updated', (_, updatedBackups) => {
            setBackups(updatedBackups);
        });

        // Initial load
        ipcRenderer.send('get-backups');

        return () => {
            ipcRenderer.removeAllListeners('backups-updated');
        };
    }, []);

    const createBackup = async () => {
        await ipcRenderer.invoke('create-backup');
    };

    const restoreBackup = async (backupId) => {
        await ipcRenderer.invoke('restore-backup', backupId);
    };

    const deleteBackup = async (backupId) => {
        await ipcRenderer.invoke('delete-backup', backupId);
    };

    const scheduleBackup = async () => {
        await ipcRenderer.invoke('schedule-backup');
    };

    return { backups, createBackup, restoreBackup, deleteBackup, scheduleBackup };
};
