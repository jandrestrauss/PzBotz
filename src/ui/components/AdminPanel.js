import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';

const AdminPanel = () => {
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
        <div className="admin-panel">
            <h2>Admin Panel</h2>
            <div className="users-list">
                {users.map(user => (
                    <div key={user.id} className="user-card"></div>
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

export default AdminPanel;
