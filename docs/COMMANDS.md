# Bot Commands Documentation

## General Commands
| Command | Description | Usage | Permission |
|---------|-------------|-------|------------|
| `!help` | Show available commands | `!help` | User |
| `!bot_info` | Display bot information | `!bot_info` | User |
| `!server_status` | Show server status | `!server_status` | User |
| `!balance` | Check points balance | `!balance` | User |

## Economy System
| Command | Description | Usage | Permission |
|---------|-------------|-------|------------|
| `!shop` | Display shop items | `!shop` | User |
| `!buyticket` | Buy wheel spin ticket | `!buyticket [accountName]` | User |
| `!wheelspin` | Use wheel spin ticket | `!wheelspin [accountName]` | User |
| `!addpoints` | Add points to user | `!addpoints [userId] [accountName] [amount]` | Admin |

## Server Management
| Command | Description | Usage | Permission |
|---------|-------------|-------|------------|
| `!restart_server` | Restart server | `!restart_server` | Admin |
| `!backup_server` | Create backup | `!backup_server` | Admin |
| `!server_cmd` | Send console command | `!server_cmd [command]` | Admin |
| `!add_workshop_mod` | Add workshop mod | `!add_workshop_mod [modURL]` | Admin |

## Player Management
| Command | Description | Usage | Permission |
|---------|-------------|-------|------------|
| `!kick_user` | Kick player | `!kick_user [username]` | Admin |
| `!ban_user` | Ban player | `!ban_user [username] [reason]` | Admin |
| `!godmode` | Toggle godmode | `!godmode [username]` | Admin |
| `!teleport` | Teleport player | `!teleport [player1] [player2]` | Admin |

## Configuration
| Command | Description | Usage | Permission |
|---------|-------------|-------|------------|
| `!reloadconfig` | Reload configuration | `!reloadconfig` | Admin |
| `!setwheel` | Set wheel type | `!setwheel [default/premium]` | Admin |
| `!addshopitem` | Add shop item | `!addshopitem [name] [price]` | Admin |
