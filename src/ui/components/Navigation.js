
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

const Navigation = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="main-nav">
            <div className="nav-brand">
                <Link to="/">PZBot Dashboard</Link>
            </div>
            <div className="nav-links">
                <Link to="/dashboard">Dashboard</Link>
                {user?.isAdmin && <Link to="/admin">Admin</Link>}
                <Link to="/profile">Profile</Link>
                <button onClick={logout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navigation;