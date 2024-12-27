import { Rcon } from 'rcon-client';
import { logger } from '@utils/logger';

export async function createRconClient(): Promise<Rcon> {
  const rcon = new Rcon({
    host: process.env.PZ_HOST || 'localhost',
    port: parseInt(process.env.PZ_RCON_PORT || '27015'),
    password: process.env.PZ_RCON_PASSWORD || ''
  });

  rcon.on('connect', () => {
    logger.info('RCON connected successfully');
  });

  rcon.on('error', (error) => {
    logger.error('RCON error:', error);
  });

  await rcon.connect();
  return rcon;
}
