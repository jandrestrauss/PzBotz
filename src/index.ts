import express from 'express';
import { config } from 'dotenv';
import { setupBot } from './bot';
import { setupServer } from './server';
import { logger } from './utils/logger';

config();

const app = express();
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await setupBot();
    await setupServer(app);
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

main();
