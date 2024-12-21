const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');
const config = require('./config');
const LocalStrategy = require('passport-local').Strategy;

class DashboardServer {
    constructor(bot) {
        this.bot = bot;
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        
        this.setupMiddleware();
        this.setupWebSocket();
        this.setupRoutes();
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

        passport.use(new LocalStrategy(
            (username, password, done) => {
                // Replace with your user authentication logic
                if (username === 'admin' && password === 'password') {
                    return done(null, { username: 'admin' });
                } else {
                    return done(null, false, { message: 'Incorrect credentials.' });
                }
            }
        ));

        passport.serializeUser((user, done) => {
            done(null, user.username);
        });

        passport.deserializeUser((username, done) => {
            // Replace with your user retrieval logic
            if (username === 'admin') {
                done(null, { username: 'admin' });
            } else {
                done(new Error('User not found'));
            }
        });

        // Add error handling middleware
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Something went wrong!' });
        });
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('New WebSocket connection');
            
            // Send updates every 5 seconds
            const interval = setInterval(async () => {
                try {
                    const stats = await this.bot.getServerStats();
                    ws.send(JSON.stringify({
                        type: 'stats',
                        data: stats
                    }));
                } catch (error) {
                    console.error('Error sending stats:', error);
                }
            }, 5000);

            ws.on('close', () => {
                clearInterval(interval);
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
                clearInterval(interval);
            });

            ws.on('message', (message) => {
                console.log('Received:', message);
            });

            // Send initial data
            ws.send(JSON.stringify({
                playerCount: this.bot.playerCount,
                cpu: this.bot.cpuUsage,
                memory: this.bot.memoryUsage,
                disk: this.bot.diskUsage
            }));
        });
    }

    setupRoutes() {
        this.app.get('/', (req, res) => {
            res.render('dashboard', {
                title: 'PZ Server Dashboard',
                serverStatus: this.bot.serverStatus,
                playerCount: this.bot.playerCount
            });
        });

        this.app.get('/api/stats', async (req, res) => {
            const stats = await this.bot.getServerStats();
            res.json(stats);
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

        this.app.use((req, res, next) => {
            if (req.isAuthenticated()) {
                return next();
            }
            res.redirect('/login');
        });

        this.app.get('/players', (req, res) => {
            res.render('players', { title: 'Players', players: this.bot.players });
        });

        this.app.get('/server', (req, res) => {
            res.render('server', { title: 'Server', serverStatus: this.bot.serverStatus });
        });

        this.app.get('/mods', (req, res) => {
            res.render('mods', { title: 'Mods', mods: this.bot.mods });
        });

        this.app.get('/backups', (req, res) => {
            res.render('backups', { title: 'Backups', backups: this.bot.backups });
        });

        // Add API endpoints for server control
        this.app.post('/api/server/restart', async (req, res) => {
            try {
                await this.bot.restartServer();
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/server/backup', async (req, res) => {
            try {
                await this.bot.createBackup();
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }

    start(port = 3000) {
        this.server.listen(port, () => {
            console.log(`Dashboard running on http://localhost:${port}`);
        });
    }
}

module.exports = DashboardServer;
