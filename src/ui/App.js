
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import Navigation from './ui/components/Navigation';
import Dashboard from './ui/components/Dashboard';
import AdminPanel from './ui/components/AdminPanel';
import Profile from './ui/components/Profile';
import Statistics from './ui/components/Statistics';
import Settings from './ui/components/Settings';
import Login from './ui/components/Login';
import Logout from './ui/components/Logout';
import UserManagement from './ui/components/UserManagement';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navigation />
                <Switch>
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/admin" component={AdminPanel} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/statistics" component={Statistics} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/login" component={Login} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/users" component={UserManagement} />
                    <Route path="/" exact component={Dashboard} />
                </Switch>
            </Router>
        </AuthProvider>
    );
};

export default App;