import React, { useState, useEffect } from 'react';

const Logs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        const response = await fetch('/api/logs');
        const data = await response.json();
        setLogs(data);
    };

    return (
        <div className="logs-container">
            <h2>Server Logs</h2>
            <div className="logs-list">
                {logs.map((log, index) => (
                    <div key={index} className="log-entry">
                        <p>{log.timestamp}: {log.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Logs;
