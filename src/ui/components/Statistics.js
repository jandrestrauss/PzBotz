import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

const Statistics = () => {
    const [stats, setStats] = useState({
        dailyUsers: [],
        pointsDistribution: {},
        serverUptime: [],
        commandUsage: {}
    });

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        const response = await fetch('/api/stats/detailed');
        const data = await response.json();
        setStats(data);
    };

    return (
        <div className="statistics-container">
            <h2>Server Statistics</h2>
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Daily Active Users</h3>
                    <Line data={stats.dailyUsers} />
                </div>
                <div className="chart-card">
                    <h3>Points Distribution</h3>
                    <Pie data={stats.pointsDistribution} />
                </div>
                <div className="chart-card">
                    <h3>Server Uptime</h3>
                    <Bar data={stats.serverUptime} />
                </div>
            </div>
        </div>
    );
};

export default Statistics;
