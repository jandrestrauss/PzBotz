import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        points: 0,
        joinDate: '',
        settings: {}
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const response = await fetch(`/api/users/${user.id}/profile`);
        const data = await response.json();
        setProfile(data);
    };

    const handleSave = async (updates) => {
        await fetch(`/api/users/${user.id}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        await fetchProfile();
    };

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            <div className="profile-info">
                <h3>Username: {profile.username}</h3>
                <p>Points: {profile.points}</p>
                <p>Member since: {new Date(profile.joinDate).toLocaleDateString()}</p>
            </div>
            <div className="profile-settings">
                <h3>Settings</h3>
                {/* Add settings controls here */}
            </div>
        </div>
    );
};

export default Profile;
