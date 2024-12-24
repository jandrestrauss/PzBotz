const fs = require('fs');
const path = require('path');
const readline = require('readline');
const logger = require('./utils/logger');

class Setup {
    constructor() {
        this.configPath = path.join(__dirname, '../config');
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async run() {
        logger.logEvent('Starting setup...');
        
        await this.createDirectories();
        await this.setupConfig();
        await this.configureBot();
        
        this.rl.close();
        logger.logEvent('Setup completed successfully');
    }

    async createDirectories() {
        const dirs = ['logs', 'backups', 'data', 'config'];
        for (const dir of dirs) {
            const dirPath = path.join(__dirname, '..', dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                logger.logEvent(`Created directory: ${dir}`);
            }
        }
    }

    async setupConfig() {
        // Create default config files if they don't exist
        const configs = {
            'shop.json': [],
            'wheel.json': [],
            'death_messages.json': []
        };

        for (const [file, defaultContent] of Object.entries(configs)) {
            const filePath = path.join(this.configPath, file);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
                logger.logEvent(`Created config file: ${file}`);
            }
        }
    }

    async configureBot() {
        const envPath = path.join(__dirname, '../.env');
        if (!fs.existsSync(envPath)) {
            const token = await this.prompt('Enter your Discord bot token: ');
            const rconHost = await this.prompt('Enter RCON host (default: localhost): ') || 'localhost';
            const rconPort = await this.prompt('Enter RCON port (default: 27015): ') || '27015';
            const rconPass = await this.prompt('Enter RCON password: ');

            const envContent = `
DISCORD_TOKEN=${token}
RCON_HOST=${rconHost}
RCON_PORT=${rconPort}
RCON_PASSWORD=${rconPass}
LOG_LEVEL=info
`;
            fs.writeFileSync(envPath, envContent.trim());
            logger.logEvent('Created .env file');
        }
    }

    prompt(question) {
        return new Promise(resolve => {
            this.rl.question(question, answer => resolve(answer));
        });
    }
}

// Run setup if called directly
if (require.main === module) {
    new Setup().run().catch(error => {
        logger.error('Setup failed:', error);
        process.exit(1);
    });
}

module.exports = Setup;
