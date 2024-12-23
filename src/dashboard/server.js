const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const { requireAuth, requireRole } = require('./middleware/auth');
const userManagement = require('./services/userManagement');
const logger = require('./services/logger');

class DashboardServer {
    constructor(monitor) {
        this.app = express();
        this.monitor = monitor;
        this.io = require('socket.io')(this.server);

        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
        this.setupErrorHandlers();
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    setupRoutes() {
        this.app.get('/dashboard', requireAuth, async (req, res) => {
            try {
                const [serverStatus, playerCount, metrics] = await Promise.all([
                    this.monitor.getStatus(),
                    this.monitor.getPlayerCount(),
                    this.monitor.getServerMetrics()
                ]);

                res.render('dashboard', {
                    serverStatus,
                    playerCount,
                    metrics,
                    user: req.session.user
                });
            } catch (error) {
                logger.error('Dashboard error:', error);
                res.redirect('/login');
            }
        });

        this.app.post('/api/users', requireAuth, requireRole('admin'), async (req, res) => {
            try {
                const { username, password, role } = req.body;
                const user = await userManagement.createUser(username, password, role);
                res.json({ success: true, user });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/api/users', requireAuth, requireRole('admin'), async (req, res) => {
            try {
                const users = await userManagement.getUsers();
                res.json(users);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.put('/api/users/:id', requireAuth, requireRole('admin'), async (req, res) => {
            try {
                const updates = req.body;
                const user = await userManagement.updateUser(req.params.id, updates);
                res.json({ success: true, user });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.delete('/api/users/:id', requireAuth, requireRole('admin'), async (req, res) => {
            try {
                await userManagement.deleteUser(req.params.id);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.get('/settings', requireAuth, requireRole('admin'), async (req, res) => {
            try {
                const settings = await this.monitor.getSettings();
                res.render('settings', {
                    user: req.user,
                    settings,
                    title: 'Server Settings'
                });
            } catch (error) {
                res.status(500).render('error', { error });
            }
        });

        this.app.get('/login', (req, res) => {
            res.render('login', { title: 'Login' });
        });

        this.app.post('/login', passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

        this.app.get('/logout', (req, res) => {
            req.logout();
            res.redirect('/login');
        });
    }

    setupWebSocket() {
        this.io.on('connection', (socket) => {
            logger.info('Client connected');

            socket.on('subscribe', (channels) => {
                if (Array.isArray(channels)) {
                    channels.forEach(channel => {
                        if (['server', 'players', 'economy'].includes(channel)) {
                            socket.join(channel);
                        }
                    });
                }
            });

            socket.on('disconnect', () => {
                logger.info('Client disconnected');
            });
        });
    }

    setupErrorHandlers() {
        this.app.use((err, req, res, next) => {
            logger.error('Express error:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
    }
}

module.exports = DashboardServer;
