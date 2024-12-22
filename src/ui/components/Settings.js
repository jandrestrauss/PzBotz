import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';

const Settings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({});
    const [preferences, setPreferences] = useState({});

    useEffect(() => {
        fetchSettings();
        fetchPreferences();
    }, []);

    const fetchSettings = async () => {
        const response = await fetch(`/api/users/${user.id}/settings`);
        const data = await response.json();
        setSettings(data);
    };

    const fetchPreferences = async () => {
        const response = await fetch(`/api/users/${user.id}/preferences`);
        const data = await response.json();
        setPreferences(data);
    };

    const handleSave = async (updates) => {
        await fetch(`/api/users/${user.id}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        await fetchSettings();
    };

    const handleSavePreferences = async (updates) => {
        await fetch(`/api/users/${user.id}/preferences`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        await fetchPreferences();
    };

    return (
        <div className="settings-container">
            <h2>User Settings</h2>
            <div className="settings-form">
                {/* Add form controls for settings here */}
                <button onClick={() => handleSave(settings)}>Save Settings</button>
            </div>
            <h2>User Preferences</h2>
            <div className="preferences-form">
                {/* Add form controls for preferences here */}
                <button onClick={() => handleSavePreferences(preferences)}>Save Preferences</button>
            </div>
        </div>
    );
};

export default Settings;
