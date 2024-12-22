import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
    };

    const handleUserAction = async (userId, action) => {
        await fetch(`/api/users/${userId}/${action}`, { method: 'POST' });
        await fetchUsers();
    };

    return (
        <div className="user-management">
            <h2>User Management</h2>
            <div className="users-list">
                {users.map(user => (
                    <div key={user.id} className="user-card">
                        <h3>{user.username}</h3>
                        <p>Role: {user.role}</p>
                        <div className="actions">
                            <button onClick={() => handleUserAction(user.id, 'ban')}>
                                Ban User
                            </button>
                            <button onClick={() => handleUserAction(user.id, 'reset')}>
                                Reset Points
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;
