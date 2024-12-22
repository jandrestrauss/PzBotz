import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [stats, setStats] = useState({});
    
    useEffect(() => {
        const fetchStats = async () => {
            const response = await fetch('/api/stats/realtime');
            const data = await response.json();
            setStats(data);
        };
        
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard">
            <h1>Server Dashboard</h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Players Online</h3>
                    <p>{stats.playerCount || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Server Status</h3>
                    <p>{stats.status ? 'Online' : 'Offline'}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
