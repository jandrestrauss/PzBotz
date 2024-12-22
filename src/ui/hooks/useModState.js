import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

export const useModState = () => {
    const [mods, setMods] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        ipcRenderer.on('mods-updated', (_, updatedMods) => {
            setMods(updatedMods);
        });

        // Initial load
        ipcRenderer.send('get-mods');

        return () => {
            ipcRenderer.removeAllListeners('mods-updated');
        };
    }, []);

    const updateMod = async (modId) => {
        setLoading(true);
        try {
            await ipcRenderer.invoke('update-mod', modId);
        } finally {
            setLoading(false);
        }
    };

    const installMod = async (workshopId) => {
        setLoading(true);
        try {
            await ipcRenderer.invoke('install-mod', workshopId);
        } finally {
            setLoading(false);
        }
    };

    return { mods, loading, updateMod, installMod };
};
