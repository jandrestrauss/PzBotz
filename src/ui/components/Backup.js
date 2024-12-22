import React, { useState, useEffect } from 'react';

const Backup = () => {
    const [backups, setBackups] = useState([]);

    useEffect(() => {
        fetchBackups();
    }, []);

    const fetchBackups = async () => {
        const response = await fetch('/api/backups');
        const data = await response.json();
        setBackups(data);
    };

    const handleBackup = async () => {
        await fetch('/api/server/backup', { method: 'POST' });
        await fetchBackups();
    };

    return (
        <div className="backup-container">
            <h2>Server Backups</h2>
            <button onClick={handleBackup}>Create Backup</button>
            <div className="backups-list">
                {backups.map((backup, index) => (
                    <div key={index} className="backup-entry">
                        <p>{backup.timestamp}: {backup.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Backup;
