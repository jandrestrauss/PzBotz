import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import { setupRoutes } from './routes';
import { errorHandler } from './middleware/error';
import { createRconClient } from './rcon';
import { logger } from '@utils/logger';

export async function setupServer(app: Express): Promise<void> {
  // Rate limiting
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  }));

  // Middleware
  app.use(express.json());
  
  // Initialize RCON client
  const rcon = await createRconClient();
  app.locals.rcon = rcon;

  // Setup routes
  setupRoutes(app);

  // Error handling
  app.use(errorHandler);
}
