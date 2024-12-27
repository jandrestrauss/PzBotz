export interface ServerConfig {
  port: number;
  host: string;
  rconPort: number;
  rconPassword: string;
}

export interface BotConfig {
  token: string;
  prefix: string;
  ownerId: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export type Config = {
  server: ServerConfig;
  bot: BotConfig;
  database: DatabaseConfig;
}
