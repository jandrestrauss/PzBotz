import React, { useState, useEffect } from 'react';

const PerformanceOptimization = () => {
    const [optimizations, setOptimizations] = useState([]);

    useEffect(() => {
        fetchOptimizations();
    }, []);

    const fetchOptimizations = async () => {
        const response = await fetch('/api/optimizations');
        const data = await response.json();
        setOptimizations(data);
    };

    const handleOptimizationAction = async (optimizationId, action) => {
        await fetch(`/api/optimizations/${optimizationId}/${action}`, { method: 'POST' });
        await fetchOptimizations();
    };

    return (
        <div className="performance-optimization">
            <h2>Performance Optimization</h2>
            <div className="optimizations-list">
                {optimizations.map(optimization => (
                    <div key={optimization.id} className="optimization-card">
                        <h3>{optimization.name}</h3>
                        <p>{optimization.description}</p>
                        <div className="actions">
                            <button onClick={() => handleOptimizationAction(optimization.id, 'run')}>
                                Run
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PerformanceOptimization;
