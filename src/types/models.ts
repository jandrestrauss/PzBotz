export interface BaseModel {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Server extends BaseModel {
  name: string;
  ip: string;
  port: number;
  rcon_port: number;
  rcon_password: string;
  status: 'online' | 'offline';
}

export interface Player extends BaseModel {
  steam_id: string;
  discord_id?: string;
  username: string;
  last_seen: Date;
  playtime: number;
  server_id: number;
}

export interface ServerStats extends BaseModel {
  server_id: number;
  players_online: number;
  cpu_usage: number;
  memory_usage: number;
  timestamp: Date;
}
