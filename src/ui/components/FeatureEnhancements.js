import React, { useState, useEffect } from 'react';

const FeatureEnhancements = () => {
    const [features, setFeatures] = useState([]);

    useEffect(() => {
        fetchFeatures();
    }, []);

    const fetchFeatures = async () => {
        const response = await fetch('/api/features');
        const data = await response.json();
        setFeatures(data);
    };

    const handleFeatureAction = async (featureId, action) => {
        await fetch(`/api/features/${featureId}/${action}`, { method: 'POST' });
        await fetchFeatures();
    };

    return (
        <div className="feature-enhancements">
            <h2>Feature Enhancements</h2>
            <div className="features-list">
                {features.map(feature => (
                    <div key={feature.id} className="feature-card">
                        <h3>{feature.name}</h3>
                        <p>{feature.description}</p>
                        <div className="actions">
                            <button onClick={() => handleFeatureAction(feature.id, 'enable')}>
                                Enable
                            </button>
                            <button onClick={() => handleFeatureAction(feature.id, 'disable')}>
                                Disable
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureEnhancements;
