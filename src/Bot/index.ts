import { Client, GatewayIntentBits } from 'discord.js';
import { logger } from '@utils/logger';
import { BotConfig } from '@types/index';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

export async function setupBot(): Promise<void> {
  try {
    const token = process.env.DISCORD_TOKEN;
    if (!token) {
      throw new Error('Discord token not found in environment variables');
    }

    client.on('ready', () => {
      logger.info(`Logged in as ${client.user?.tag}`);
    });

    await client.login(token);
  } catch (error) {
    logger.error('Failed to setup Discord bot:', error);
    throw error;
  }
}
