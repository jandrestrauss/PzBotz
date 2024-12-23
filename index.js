const fs = require('fs');
const path = require('path');
const { runMigrations } = require('./src/database/migrations');
const { updateDocumentation } = require('./src/documentation/documentation');
const advancedMetrics = require('./src/monitoring/advancedMetrics');
const { connectToGameServer } = require('./src/utils/connectToGameServer');
const { isServerRunning } = require('./src/utils/serverUtils');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const directoryPath = path.join(__dirname);
const outputFilePath = path.join(__dirname, 'INDEX.md');

function scanDirectory(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            fileList = scanDirectory(filePath, fileList);
        } else {
            fileList.push(filePath.replace(directoryPath, '').replace(/\\/g, '/'));
        }
    });
    return fileList;
}

function generateIndex(fileList) {
    let indexContent = '# Project Directory Index\n\n';
    fileList.forEach(file => {
        indexContent += `- [${file}](.${file})\n`;
    });
    return indexContent;
}

const fileList = scanDirectory(directoryPath);
const indexContent = generateIndex(fileList);

fs.writeFileSync(outputFilePath, indexContent, 'utf8');
console.log('Index generated successfully.');

async function readServerConsole() {
    try {
        const rcon = await connectToGameServer();
        if (!rcon) {
            console.error('Failed to connect to server console. Retrying in 5 seconds...');
            setTimeout(readServerConsole, 5000);
            return;
        }

        console.log('Connected to server console');

        // Set up event handlers
        rcon.on('connect', () => {
            console.log('Server console connection established');
        });

        rcon.on('authenticated', () => {
            console.log('Authenticated with server console');
            // Subscribe to console output
            rcon.send('servermsg "Discord bot connected to server console"');
        });

        rcon.on('message', (message) => {
            // Log server console messages
            console.log(`Server Console: ${message}`);
            
            // Check for specific message types
            if (message.includes('Player connected')) {
                // Handle player connection
                const username = message.split('Player connected')[1].trim();
                console.log(`Player connected: ${username}`);
            } else if (message.includes('Player disconnected')) {
                // Handle player disconnection  
                const username = message.split('Player disconnected')[1].trim();
                console.log(`Player disconnected: ${username}`);
            }
        });

        rcon.on('error', (error) => {
            console.error('Server console error:', error);
            rcon.end();
        });

        rcon.on('end', () => {
            console.log('Server console connection closed. Reconnecting...');
            setTimeout(readServerConsole, 5000); // Retry connection after 5 seconds
        });

    } catch (error) {
        console.error('Error connecting to server console:', error);
        setTimeout(readServerConsole, 5000); // Retry connection after 5 seconds
    }
}

async function initializeApp() {
    await runMigrations();
    updateDocumentation();
    readServerConsole();

    // Initialize and start monitoring
    advancedMetrics.startMonitoring();

    // Add this to your existing intervals
    setInterval(() => {
        if (!isServerRunning()) {
            console.log('Server not running, attempting to reconnect console...');
            readServerConsole();
        }
    }, 60 * 1000); // Check connection every minute
}

initializeApp();

const limiter = rateLimit({
  store: new RedisStore({
    client: redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

// Apply to all routes
app.use(limiter);
