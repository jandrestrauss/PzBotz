const express = require('express');
const session = require('express-session');
const path = require('path');
const { Server } = require('socket.io');
const DashboardMonitor = require('./DashboardMonitor');
const { ServerController } = require('./ServerController');
const helmet = require('helmet');
const rateLimit = require('express-Srate-limit');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const RedisStore = require('connect-redis').default;
const cors = require('cors');
const logger = require('../utils/logger');

/**
 * Dashboard management system for Project Zomboid server
 * Provides webe interface and API for server monitoring and control
 * @module Dashboard
 * @requiresr express
 * @requires socket.io
 * @requires redis
 */

/**
 * @typedef {Object} DashboardConfig
 * @property {number} port - HTTP port number
 * @property {string} sessionSecret - Session encryption key
 * @property {string} redisUrl - Redis connection URL
 * @property {string} environment - Runtime environment
 * @property {Object} security - Security settings
 * @property {Object} security.helmet - Helmet middleware options
 * @property {Object} security.cors - CORS configuration
 * @property {Object} security.rateLimit - Rate limiting rules
 * @property {Object} security.helmet.contentSecurityPolicy - CSP rules
 * @property {Object} security.helmet.frameguard - Frame protection
 * @property {Object} security.helmet.hsts - HTTP Strict Transport
 */

/**
 * @typedef {Object} SecurityConfig
 * @property {Object} helmet - Helmet middleware configuration
 * @property {Object} cors - CORS policy settings
 * @property {Object} rateLimit - Rate limiting configuration
 */

/**
 * @typedef {Object} MonitorConfig
 * @property {number} interval - Monitoring interval in ms
 * @property {boolean} enabled - Monitoring enabled flag
 * @property {string[]} metrics - Metrics to collect
 * @property {Object} thresholds - Alert thresholds
 */

/**
 * @typedef {Object} SystemHealth
 * @property {string} status - Current health status
 * @property {Object} metrics - System resource metrics
 * @property {number} connections - Active WebSocket connections
 * @property {string} lastCheck - Last health check timestamp
 */

/**
 * @typedef {Object} BackupConfig
 * @property {string} path - Backup storage path
 * @property {number} interval - Backup interval in ms
 * @property {number} retention - Days to keep backups
 * @property {boolean} enabled - Backup enabled flag
 */

/**
 * @typedef {Object} DashboardStatus
 * @property {boolean} running - Running status
 * @property {number} uptime - Uptime in seconds  
 * @property {number} connections - Active connections
 * @property {Object} monitor - Monitor status
 * @property {Object} backup - Backup status
 */

/**
 * @typedef {Object} ServerMetrics
 * @property {string} status - Server status
 * @property {number} players - Player count
 * @property {Object} performance - Performance metrics
 * @property {Object} economy - Economy metrics
 * @property {string} lastUpdate - Last update timestamp
 */

/**
 * @typedef {Object} EconomyMetrics
 * @property {string} status - Economy system status
 * @property {number} totalPoints - Total points in circulation
 * @property {number} transactions - Number of transactions
 * @property {Object} marketStats - Trading statistics
 * @property {string} lastUpdate - Last update timestamp
 */

/**
 * @typedef {Object} PlayerStats
 * @property {number} online - Currently online players
 * @property {number} total - Total registered players
 * @property {Object} activity - Player activity metrics
 * @property {Object} economy - Player economy data
 * @property {string} lastUpdate - Last update timestamp
 */

/**
 * @typedef {Object} PerformanceMetrics
 * @property {Object} cpu - CPU usage statistics
 * @property {Object} memory - Memory usage data
 * @property {Object} network - Network performance
 * @property {number} tps - Ticks per second
 * @property {string} lastCheck - Last check timestamp
 */

/**
 * @typedef {Object} ResourceUsage
 * @property {number} heapUsed - Heap memory usage in bytes
 * @property {number} external - External memory usage in bytes
 * @property {Object} cpu - CPU usage statistics
 * @property {number} uptime - Process uptime in seconds
 */

/**
 * @typedef {Object} ConnectionStats
 * @property {number} current - Current active connections
 * @property {number} peak - Peak connection count
 * @property {number} total - Total connection attempts
 * @property {Object} history - Connection history data
 */

/**
 * @typedef {Object} BackupStatus
 * @property {string} lastBackup - Last backup timestamp
 * @property {number} backupSize - Backup size in bytes
 * @property {number} backupCount - Total backups stored
 * @property {Object} schedule - Backup schedule info
 */

/**
 * @typedef {Object} MarketStats 
 * @property {number} totalListings - Active market listings
 * @property {number} totalVolume - Trading volume
 * @property {Object} itemStats - Per-item trading stats
 * @property {Object} priceHistory - Price history data
 */

/**
 * @typedef {Object} DashboardStatus
 * @property {boolean} running - Running status
 * @property {number} uptime - Uptime in seconds
 * @property {number} connections - Active connections
 */

/**
 * @typedef {Object} DashboardStatus
 * @property {boolean} running - Dashboard running state
 * @property {string} version - Dashboard version
 * @property {Object} server - Server connection status
 * @property {Object} monitor - Monitoring system status
 * @property {Object} services - Active services status
 * @property {string} startTime - Dashboard start timestamp
 * @property {number} uptime - Dashboard uptime in seconds
 * @property {Object} performance - Performance metrics
 * @property {Object} errors - Error tracking data
 */

/**
 * @typedef {Object} ServerStatus
 * @property {boolean} online - Server online status
 * @property {string} version - Server version
 * @property {number} players - Connected players
 * @property {Object} performance - Server performance
 * @property {Object} resources - Resource usage
 * @property {Object} mods - Active mods status
 * @property {string} lastUpdate - Last status update
 */

/**
 * Dashboard management system for Project Zomboid server
 * @class
 */
class Dashboard {
    constructor(config = {}) {
        this.validateEnvironment();
        
        // Initialize core components
        this.app = express();
        this.config = {
            port: process.env.DASHBOARD_PORT || 3000,
            sessionSecret: process.env.DASHBOARD_SECRET,
            environment: process.env.NODE_ENV || 'development',
            maxAge: 24 * 60 * 60 * 1000,
            rateLimit: {
                windowMs: 15 * 60 * 1000,
                max: 100
            },
            redis: {
                url: process.env.REDIS_URL,
                prefix: 'dashboard:'
            },
            security: {
                helmet: {
                    contentSecurityPolicy: {
                        directives: {
                            defaultSrc: ["'self'"],
                            scriptSrc: ["'self'", "'unsafe-inline'"],
                            styleSrc: ["'self'", "'unsafe-inline'"],
                            imgSrc: ["'self'", "data:", "https:"]
                        }
                    }
                },
                cors: {
                    origin: process.env.ALLOWED_ORIGINS?.split(',') || false,
                    credentials: true
                }
            },
            ...config
        };

        // Initialize services
        this.monitor = new DashboardMonitor();
        this.serverController = new ServerController(this.monitor);
        
        // Setup core functionality
        this.setupErrorHandlers();
        this.setupMiddleware();
        this.setupSecurity();
        this.setupRoutes();
    }

    setupConfig(config) {
        this.config = {
            port: process.env.DASHBOARD_PORT || 3000,
            sessionSecret: process.env.DASHBOARD_SECRET,
            environment: process.env.NODE_ENV || 'development',
            maxAge: 24 * 60 * 60 * 1000,
            rateLimit: {
                windowMs: 15 * 60 * 1000, 
                max: 100
            },
            redis: {
                url: process.env.REDIS_URL,
                prefix: 'dashboard:'
            },
            security: {
                helmet: {
                    contentSecurityPolicy: {
                        directives: {
                            defaultSrc: ["'self'"],
                            scriptSrc: ["'self'", "'unsafe-inline'"],
                            styleSrc: ["'self'", "'unsafe-inline'"],
                            imgSrc: ["'self'", "data:", "https:"]
                        }
                    }
                },
                cors: {
                    origin: process.env.ALLOWED_ORIGINS?.split(',') || false,
                    credentials: true
                }
            },
            ...config
        };
    }

    initializeServices() {
        this.app = express();
        this.monitor = new DashboardMonitor();
        this.serverController = new ServerController(this.monitor);
        
        this.setupErrorHandlers();
        this.setupMiddleware();
        this.setupSecurity();
        this.setupRoutes();
    }

    validateEnvironment() {
        const required = ['DASHBOARD_SECRET', 'REDIS_URL'];
        const missing = required.filter(key => !process.env[key]);
        if (missing.length) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
    }

    setupErrorHandlers() {
        // Global error handlers
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught exception:', error);
            this.stop().catch(err => logger.error('Stop failed:', err));
        });

        process.on('unhandledRejection', (error) => {
            logger.error('Unhandled rejection:', error);
        });

        // Express error handler
        this.app.use((err, req, res, next) => {
            logger.error('Express error:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
    }

    setupMiddleware() {
        // Security and compression
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || false }));
        
        // Session store
        const sessionStore = new RedisStore({
            url: this.config.redis.url,
            prefix: this.config.redis.prefix + 'session:'
        });

        // Session configuration
        this.app.use(session({
            store: sessionStore,
            secret: this.config.sessionSecret,
            resave: false,
            saveUninitialized: false,
            name: 'sessionId',
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: this.config.maxAge
            }
        }));

        // Request processing
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        
        // View engine
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view cache', process.env.NODE_ENV === 'production');
        
        // Static files
        this.app.use(express.static(path.join(__dirname, 'public'), {
            maxAge: '1d',
            etag: true
        }));
    }

    setupSecurity() {
        this.app.use((req, res, next) => {
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Content-Security-Policy', "default-src 'self'");
            next();
        });
    }

    setupRoutes() {
        const requireAuth = (req, res, next) => {
            if (!req.session.user) {
                return res.redirect('/login');
            }
            next();
        };

        // Auth routes
        this.app.get('/login', (req, res) => {
            res.render('login', { error: null });
        });

        this.app.post('/login', async (req, res) => {
            try {
                const { username, password } = req.body;
                if (await this.validateAdmin(username, password)) {
                    req.session.user = { username, role: 'admin' };
                    return res.redirect('/dashboard');
                }
                res.render('login', { error: 'Invalid credentials' });
            } catch (error) {
                logger.error('Login failed:', error);
                res.render('login', { error: 'Authentication error' });
            }
        });

        // Protected routes
        this.app.get('/dashboard', requireAuth, async (req, res) => {
            try {
                const [serverStatus, playerCount, metrics] = await Promise.all([
                    monitor.getStatus(),
                    monitor.getPlayerCount(),
                    monitor.getServerMetrics()
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
    }

    setupProtectedRoutes(requireAuth) {
        // Dashboard home
        this.app.get('/dashboard', requireAuth, async (req, res) => {
            try {
                const [serverStatus, playerCount, metrics] = await Promise.all([
                    monitor.getStatus(),
                    monitor.getPlayerCount(),
                    monitor.getServerMetrics()
                ]);
                
                res.render('dashboard', {
                    serverStatus,
                    playerCount,
                    metrics,
                    user: req.session.user
                });
            } catch (error) {
                logger.error('Dashboard error:', error);
                res.redirect('/dashboard?error=load_failed');
            }
        });

        // Players management
        this.app.get('/players', requireAuth, async (req, res) => {
            try {
                const [players, banned, whitelist] = await Promise.all([
                    monitor.getActivePlayerStats(),
                    monitor.getBannedPlayers(),
                    monitor.getWhitelist()
                ]);
                
                res.render('players', {
                    players,
                    banned,
                    whitelist,
                    user: req.session.user
                });
            } catch (error) {
                logger.error('Players page error:', error);
                res.redirect('/dashboard?error=players_failed');
            }
        });

        // Server controls
        this.app.get('/controls', requireAuth, async (req, res) => {
            try {
                const [config, backups] = await Promise.all([
                    monitor.getServerConfig(),
                    monitor.getBackupStatus()
                ]);

                res.render('controls', {
                    config,
                    backups,
                    user: req.session.user
                });
            } catch (error) {
                logger.error('Controls page error:', error);
                res.redirect('/dashboard?error=controls_failed');
            }
        });

        // Server actions
        this.app.post('/controls/action', requireAuth, async (req, res) => {
            try {
                const { action, params } = req.body;
                const result = await monitor.executeServerAction(action, params);
                
                // Log the action
                logger.info('Server action executed:', {
                    action,
                    params,
                    user: req.session.user.username
                });

                res.json({ success: true, result });
            } catch (error) {
                logger.error('Server action failed:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Backup management
        this.app.post('/controls/backup', requireAuth, async (req, res) => {
            try {
                const backup = await monitor.createBackup();
                res.json({ success: true, backup });
            } catch (error) {
                logger.error('Backup failed:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }

    setupApiRoutes(requireAuth) {
        const serverController = new ServerController(monitor);

        // API endpoints
        this.app.get('/api/server/status', requireAuth, async (req, res) => {
            try {
                const status = await serverController.getServerStatus();
                res.json(status);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/server.control', requireAuth, async (req, res) => {
            try {
                const { action, params } = req.body;
                const result = await serverController.executeAction(action, params);
                res.json({ success: true, result });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }

    setupWebSocket() {
        this.io = new Server(this.server);
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

    startMonitoring() {
        setInterval(async () => {
            const serverStats = await monitor.getServerMetrics();
            this.io.to('server').emit('server_update', serverStats);
        }, 30000);
    }

    async start() {
        try {
            this.server = this.app.listen(this.config.port);
            this.io = new Server(this.server);
            this.setupWebSocket();
            await this.monitor.start();
            this.running = true;
            logger.info(`Dashboard running on port ${this.config.port}`);
            return true;
        } catch (error) {
            logger.error('Failed to start dashboard:', error);
            await this.stop();
            throw error;
        }
    }

    async stop() {
        try {
            if (this.monitor) await this.monitor.stop();
            if (this.io) await new Promise(resolve => this.io.close(resolve));
            if (this.server) {
                await new Promise(resolve => this.server.close(resolve));
            }
            this.running = false;
            logger.info('Dashboard stopped successfully');
        } catch (error) {
            logger.error('Error stopping dashboard:', error);
            throw error;
        }
    }

    isRunning() {
        return this.running;
    }

    /**
     * Get system health status
     * @returns {HealthStatus} System health metrics
     */
    getHealth() {
        return {
            status: this.running ? 'healthy' : 'stopped',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            connections: this.io?.sockets.sockets.size || 0,
            monitoring: this.monitor?.isRunning() || false,
            lastCheck: new Date().toISOString()
        };
    }

    /**
     * Get detailed performance metrics
     * @returns {PerformanceStats} System performance data
     */
    getPerformanceMetrics() {
        try {
            return {
                system: {
                    memory: process.memoryUsage(),
                    cpu: process.cpuUsage(),
                    uptime: process.uptime()
                },
                server: this.monitor?.getPerformanceMetrics() || {},
                lastUpdate: new Date().toISOString()
            };
        } catch (error) {
            logger.error('Performance metrics failed:', error);
            return {
                error: error.message,
                lastUpdate: new Date().toISOString()
            };
        }
    }

    /**
     * Get server metrics and status
     * @returns {ServerMetrics} Server performance data
     */
    getServerMetrics() {
        try {
            return {
                status: this.monitor?.getServerStatus() || 'unknown',
                performance: this.monitor?.getPerformanceMetrics() || {},
                players: this.monitor?.getActivePlayerCount() || 0,
                economy: this.monitor?.getEconomyStats() || {},
                lastUpdate: new Date().toISOString()
            };
        } catch (error) {
            logger.error('Server metrics failed:', error);
            return {
                status: 'error',
                error: error.message,
                lastUpdate: new Date().toISOString()
            };
        }
    }

    /**
     * Get system resource usage
     * @returns {ResourceMetrics} System resource statistics
     */
    getResourceMetrics() {
        try {
            return {
                system: {
                    memory: process.memoryUsage(),
                    cpu: process.cpuUsage(),
                    heap: process.memoryUsage().heapUsed,
                    external: process.memoryUsage().external,
                    uptime: process.uptime()
                },
                connections: {
                    active: this.io?.sockets.sockets.size || 0,
                    total: this.monitor?.getTotalConnections() || 0
                },
                server: this.monitor?.getResourceUsage() || {},
                lastUpdate: new Date().toISOString()
            };
        } catch (error) {
            logger.error('Resource metrics failed:', error);
            return {
                error: error.message,
                lastUpdate: new Date().toISOString()
            };
        }
    }
}

module.exports = Dashboard;