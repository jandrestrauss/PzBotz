const fs = require('fs-extra');
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
        try {
            logger.info('Starting setup...');
            
            await this.createDirectories();
            await this.setupConfig();
            await this.configureBot();
            
            this.rl.close();
            logger.info('Setup completed successfully');
        } catch (error) {
            logger.error('Setup failed', { error: error.message });
            this.rl.close();
            process.exit(1);
        }
    }

    async createDirectories() {
        const dirs = ['logs', 'backups', 'data', 'config'];
        for (const dir of dirs) {
            const dirPath = path.join(__dirname, '..', dir);
            try {
                await fs.ensureDir(dirPath);
                logger.info(`Created directory: ${dir}`);
            } catch (error) {
                logger.error(`Error creating directory ${dir}:`, error.message);
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
                logger.info(`Created config file: ${file}`);
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
BACKUP_PATH=/path/to/backups
`;
            fs.writeFileSync(envPath, envContent.trim());
            logger.info('Created .env file');
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
        logger.error('Fatal setup error', { error: error.message });
        process.exit(1);
    });
}

module.exports = Setup;
