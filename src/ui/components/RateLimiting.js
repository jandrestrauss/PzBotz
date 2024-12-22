import React, { useState, useEffect } from 'react';

const RateLimiting = () => {
    const [rateLimits, setRateLimits] = useState([]);

    useEffect(() => {
        fetchRateLimits();
    }, []);

    const fetchRateLimits = async () => {
        const response = await fetch('/api/rate-limits');
        const data = await response.json();
        setRateLimits(data);
    };

    const handleRateLimitUpdate = async (limitId, updates) => {
        await fetch(`/api/rate-limits/${limitId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        await fetchRateLimits();
    };

    return (
        <div className="rate-limiting">
            <h2>Rate Limiting</h2>
            <div className="rate-limits-list">
                {rateLimits.map(limit => (
                    <div key={limit.id} className="rate-limit-card">
                        <h3>{limit.name}</h3>
                        <p>Limit: {limit.limit} requests per {limit.duration} seconds</p>
                        <div className="actions">
                            <button onClick={() => handleRateLimitUpdate(limit.id, { limit: limit.limit + 10 })}>
                                Increase Limit
                            </button>
                            <button onClick={() => handleRateLimitUpdate(limit.id, { limit: limit.limit - 10 })}>
                                Decrease Limit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RateLimiting;
