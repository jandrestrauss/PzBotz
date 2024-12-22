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
                {user?.isAdmin && <Link to="/users">User Management</Link>}
                {user?.isAdmin && <Link to="/logs">Logs</Link>}
                {user?.isAdmin && <Link to="/backup">Backup</Link>}
                {user?.isAdmin && <Link to="/server-control">Server Control</Link>}
                {user?.isAdmin && <Link to="/localization">Localization</Link>}
                {user?.isAdmin && <Link to="/features">Feature Enhancements</Link>}
                {user?.isAdmin && <Link to="/performance">Performance Optimization</Link>}
                {user?.isAdmin && <Link to="/documentation">Documentation</Link>}
                {user?.isAdmin && <Link to="/alerts">Alert System</Link>}
                {user?.isAdmin && <Link to="/rate-limiting">Rate Limiting</Link>}
                {user?.isAdmin && <Link to="/advanced-statistics">Advanced Statistics</Link>}
                <Link to="/profile">Profile</Link>
                <button onClick={logout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navigation;