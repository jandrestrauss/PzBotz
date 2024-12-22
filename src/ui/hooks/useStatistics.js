import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

export const useStatistics = () => {
    const [serverStats, setServerStats] = useState([]);
    const [playerStats, setPlayerStats] = useState([]);
    const [advancedMetrics, setAdvancedMetrics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ipcRenderer.on('stats-updated', (_, stats) => {
            setServerStats(stats.server);
            setPlayerStats(stats.players);
            setAdvancedMetrics(stats.advanced);
            setLoading(false);
        });

        // Initial load
        ipcRenderer.send('get-stats');

        return () => {
            ipcRenderer.removeAllListeners('stats-updated');
        };
    }, []);

    return { serverStats, playerStats, advancedMetrics, loading };
};
