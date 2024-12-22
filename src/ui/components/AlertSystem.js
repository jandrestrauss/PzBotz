import React, { useState, useEffect } from 'react';

const AlertSystem = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        const response = await fetch('/api/alerts');
        const data = await response.json();
        setAlerts(data);
    };

    const handleAlertAction = async (alertId, action) => {
        await fetch(`/api/alerts/${alertId}/${action}`, { method: 'POST' });
        await fetchAlerts();
    };

    return (
        <div className="alert-system">
            <h2>Alert System</h2>
            <div className="alerts-list">
                {alerts.map(alert => (
                    <div key={alert.id} className="alert-card">
                        <h3>{alert.name}</h3>
                        <p>{alert.description}</p>
                        <div className="actions">
                            <button onClick={() => handleAlertAction(alert.id, 'acknowledge')}>
                                Acknowledge
                            </button>
                            <button onClick={() => handleAlertAction(alert.id, 'resolve')}>
                                Resolve
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertSystem;
