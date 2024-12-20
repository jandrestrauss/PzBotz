# Project Zomboid Discord Bot for Server Management
This bot is written for people to easily manage their Project Zomboid server using Discord. Please check the **Installation** and **Bot Configuration** sections. This bot doesn't support multiple Discord servers and only works on **Windows** operating system. Be sure to have **.NET Framework 4.7.2** installed on the machine.

<img alt="Passively Maintained" src="https://img.shields.io/badge/maintenance-passively--maintained-yellowgreen.svg" title="There are no plans for new features, but the bot is actively maintained." /><br>
*There are no plans for new features, but the bot is actively maintained.*

## Contents
* [Features](#features)
* [Installation](#installation)
  * [Creating the Discord Bot](#creating-the-discord-bot)
  * [Installing Bot Files](#installing-bot-files)
  * [Writing the Discord Bot Token Into File](#writing-the-discord-bot-token-into-file)
    * [Warning](#warning)
* [Bot Configuration](#bot-configuration)
* [Bot Commands](#bot-commands)
  * [Public Channel](#public-channel)
  * [Command Channel](#command-channel)
* [Localization](#localization)

# Features
- Automated server restart schedule with in-game and Discord warnings. (Warnings are announced when 1 hour, 30 min, 15 min, 5 min and 1 min left until server restart. Restart interval can be configured with bot commands.)
![Automated Server Restart Example](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20features/Screenshot_1.png)
- Automated server restart when a mod (workshop item) update has been detected.
![Automated Workshop Item Update Server Restart](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20features/Screenshot_4.png)
- Executing server commands through bot commands. (For example; saving server, kicking player, teleporting player, starting/stopping rain, making admin and so on. Full list will be at the bottom and will be listed under available commands.)
![Server Commands Example](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20features/Screenshot_3.png)
- Auto server start if server quits. This feature is useful if combined with mods that quit the server for whatever reason. For example, if you are using a mod that checks mod updates and when detects it, quits the server. With enabling this feature, you won't need to manually run the server. <br>
![Auto Server Start Example](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20features/Screenshot_5.png)
- `!get_ram_cpu` command for checking current RAM and CPU usage of the machine.
![RAM CPU Command Example](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20features/Screenshot_6.png)
- `!backup_server` command for backing up the server easily.
![Backup Command Example 1](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20features/Screenshot_7.png)
![Backup Command Example 2](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20features/Screenshot_8.png)
- Localization system! You can check available localizations using `!localization` command. See the [Localization](#localization) section about how to translate the bot.
<i>**Note:** It is not possible to translate commands and their descriptions at the moment. It might change in future, though.</i>
- Simple shop system to buy items using `!shop` and `!buy` commands.
- Wheel spins event to assign and give in-game rewards using tickets.
- Death message report to post funny lines and death messages in a designated channel.
- Automated backup scheduling to regularly back up the server.
- Automated log cleanup to periodically clean up old logs.
- Automated mod update notifications to notify admins when a mod update is detected.
- Automated player statistics tracking to track and display player statistics over time.
- Automated server health checks to periodically check server health and notify admins if any issues are detected.

## Project Scope

### Objectives
- Provide an easy-to-use interface for managing Project Zomboid servers via Discord.
- Automate server management tasks such as restarts, updates, and backups.
- Offer a set of commands for server administrators to control the server and manage players.
- Provide a simple shop system for users to buy items.
- Implement a wheel spins event for in-game rewards using tickets.
- Report death messages with funny lines in a designated channel.
- Automate regular backups of the server.
- Automate log cleanup to save disk space.
- Notify admins of mod updates.
- Track and display player statistics over time.
- Periodically check server health and notify admins of any issues.

### Features
- Automated server restart schedule with in-game and Discord warnings.
- Automated server restart when a mod update is detected.
- Execute server commands through Discord bot commands.
- Auto server start if the server quits unexpectedly.
- Commands to check RAM and CPU usage, and to backup the server.
- Localization support for different languages.
- Simple shop system to buy items using `!shop` and `!buy` commands.
- Wheel spins event to assign and give in-game rewards using tickets.
- Death message report to post funny lines and death messages in a designated channel.
- Automated backup scheduling to regularly back up the server.
- Automated log cleanup to periodically clean up old logs.
- Automated mod update notifications to notify admins when a mod update is detected.
- Automated player statistics tracking to track and display player statistics over time.
- Automated server health checks to periodically check server health and notify admins if any issues are detected.

### Limitations
- The bot does not support multiple Discord servers.
- Only works on Windows operating systems.
- Requires .NET Framework 4.7.2 to be installed on the machine.
- **Note:** The bot currently only supports English.

# Installation
#### Creating the Discord Bot
1. Go to [Applications](https://discord.com/developers/applications) section of Discord developer portal. (Be sure to login first.)
2. Click the `New Application` button on the top right corner of the screen.
![Creating a New Application](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20creation/Screenshot_1.png)
3. Enter your Bot's name in the pop-up then click the create button. You will be redirected to your application's (bot's) page. On that page, you can update your bot's name, description, and even load an image as an avatar.
![Bot Application Page](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20creation/Screenshot_2.png)
4. Navigate to the `Bot` section from the left menu. Then click the `Add Bot` button and confirm the pop-up. You will be redirected to your bot page.
![Adding a Bot](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20creation/Screenshot_3.png)
5. Click the `Reset Token` button and confirm the pop-up. This will create a new token for your bot. Copy the displayed token and save it in a file. You won't be able to view your bot token unless you reset it again. Also, do not share this token with anyone. It's basically the password of your bot. If you share it with someone else, they will have full control of your bot.
![Resetting the Bot Token](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20creation/Screenshot_4.png)
![Bot Token](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20creation/Screenshot_5.png)
6. Navigate to the `OAuth2` section from the left menu and select the `URL generator` from the dropdown. Check `bot` from the `Scopes` section and scroll down to `Bot Permissions`.
![OAuth2 URL Generator](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20creation/Screenshot_6.png)
7. Check the options shown below and copy the generated URL.
![Bot Permissions](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20creation/Screenshot_7.png)
8. Open the copied link in your browser. On the page, select the server (you must be an admin on the server otherwise the server won't show up but you can always send the link to an admin who can authorize the bot) that you want the bot to work in. Click the `Continue` button and then the `Authorize` button. Complete the captcha if it pops up. Now the bot has joined your server but it's not running yet.
![Authorizing the Bot](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20creation/Screenshot_8.png)
![Bot Authorized](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20creation/Screenshot_9.png)

#### Installing Bot Files
To complete this step and the next step, you must have remote access to your Windows machine.
1. Navigate to [releases](https://github.com/yourusername/PZBotV/releases) and pick a binary version. I would suggest picking the latest version as it would consist of new features and bug fixes.
2. Download the `zip` archive.
3. Extract the contents of the archive to the `Project Zomboid Dedicated Server` folder. Your directory after extraction will look like the image below.  
![Folder Structure](https://github.com/yourusername/PZBotV/blob/main/.github/images/folder_structure.png)
4. Rename the bat file you were using to start the server as `server.bat`. For example, if you were using `StartServer64.bat`, rename it as `server.bat`.

#### Writing the Discord Bot Token Into File
1. Create an empty text file in the directory and name it as `bot_token.txt` and open it.
![Creating bot_token.txt](https://github.com/yourusername/PZBotV/blob/main/.github/images/setting%20up%20bot%20token/Screenshot_1.png)
2. Paste the bot token that you saved while creating the discord bot to the first line. (It will look like the picture below.)
![Pasting the Bot Token](https://github.com/yourusername/PZBotV/blob/main/.github/images/setting%20up%20bot%20token/Screenshot_2.png)
3. Save the file and close it.

Now all you need to do is run `PZServerDiscordBot.exe`. If you set up everything correctly, the program will automatically run the Discord bot in the background and will show the Project Zomboid Server in the console. (The bot may not send the warning messages about the configuration if your discord server's last created channel is not accessible by the bot. You can just type configuration commands regardless.)
![Bot Demonstration](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20demonstration/Screenshot_2.png)

**Note**<br>
If you have never run the Project Zomboid server before, please run it without using the bot. Because when you run the Project Zomboid server for the first time, it will ask you to set up an admin account. You can't send any key presses to the console if you run the server through the discord bot's exe file. This also means you can't execute server commands directly using the console but I did set up all commands in the discord bot.

#### Warning
If the bot doesn't respond to any commands, that could mean two things: <br>
* The bot doesn't have permission to see the channel. Be sure that the bot has full access to the channel which also includes permission to send messages. After confirming the bot has full access but still won't respond, see below.
* The bot has a missing *intents* configuration. Please head to the [discord developer portal](https://discord.com/developers/applications) (which is the place you created and set up your bot), select your bot, click the `Bot` tab on the left menu and be sure that all bot intentions are enabled under the `Privileged Gateway Intents` section.
![Bot Intents Configuration](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20intents%20config/Screenshot_1.png)

# Bot Configuration
This bot uses 3 different channels to operate. The first channel is the *Public* channel where users can interact with the bot. The second channel is the *Command* channel which must be set to be only visible to server admins. This channel is used for executing server management and bot configuration commands. The third channel is the *Log* channel. There aren't any commands to execute in this channel and it's set for the bot to announce stuff. After the bot is launched for the first time (or not configured), it will ask you to configure the mentioned three channels using **!set_command_channel**, **!set_log_channel** and **!set_public_channel** commands. Those commands are very easy to use. Just reply to any channel with the tag of the channel you want the bot to be configured in. For example: `!set_public_channel #bot-public`

![Bot Configuration Example](https://github.com/yourusername/PZBotV/blob/main/.github/images/bot%20demonstration/Screenshot_1.png)

# Bot Commands
**!help** command can be used in any of the configured 3 channels which the bot will respond with the available command list for *that channel*.

#### Public Channel
- ``!bot_info`` Displays information about this bot. (!bot_info)
- ``!server_status`` Gets the server status. (!server_status)
- ``!restart_time`` Gets the next automated restart time. (!restart_time)
- ``!game_date`` Gets the current in-game date. (!game_date)

#### Command Channel
Bot Commands:
- `!set_command_channel` Sets the channel for the bot to work in. (!set_command_channel [channel tag])<br>
- `!set_log_channel` Sets the channel for the bot to work in. (!set_log_channel [channel tag])<br>
- `!set_public_channel` Sets the channel for the bot to work in. (!set_public_channel [channel tag])<br>
- `!get_settings` Gets the bot settings. (!get_settings)<br>
- `!get_schedules` Gets the remaining times until schedules to be executed. (!get_schedules)<br>
- `!get_ram_cpu` Gets the total RAM and CPU usage of the machine. (!get_ram_cpu)<br>
- `!set_restart_schedule_type` Set the server's restart schedule type. (!set_restart_schedule_type ["interval"|"time"])<br>
- `!set_restart_time` Set the server's restart time(s). The time format is "HH:mm" (using 24-hour time). Server restart schedule type must be "time". (!set_restart_time [times separated by space])<br>
- `!set_restart_interval` Set the server's restart schedule interval. Restart schedule type must be "interval". (in minutes!) (!set_restart_interval [interval in minutes])<br>
- `!set_mod_update_check_interval` Set the workshop mod update check schedule interval. (in minutes!) (!set_mod_update_check_interval [interval in minutes])<br>
- `!set_mod_update_restart_timer` Sets the restart timer for the server when a mod update is detected. (in minutes!) (!set_mod_update_restart_timer [timer in minutes])<br>
- `!toggle_non_public_mod_logging` Bot will print out non-public mods to the log channel if enabled. (!toggle_non_public_mod_logging)<br>
- `!toggle_server_auto_start` Enables/Disables the server auto start feature if the server is not running. (!toggle_server_auto_start)<br>
- `!backup_server` Creates a backup of the server. Backup files can be found in the "server_backup" folder in the directory where the bot has been launched. (!backup_server)<br>
- `!localization` Get/change current localization. (!localization [*(optional)* new localization name])<br>
- `!shop` Displays the list of items available for purchase. (!shop)<br>
- `!buy` Buys an item from the shop. (!buy [item name])<br>
- `!buyticket` Buys a wheel spin ticket using in-game server points. (!buyticket)<br>
- `!balance` Displays the user's current points and wheel spin tickets. (!balance)<br>
  
Server Commands:
- `!server_cmd` Allows you to send inputs to the server console. (!server_cmd [text])<br>
- `!server_msg` Broadcasts a message to all players in the server. (!server_msg "[message]")<br>
- `!start_server` Starts the server. (!start_server)<br>
- `!stop_server` Saves and stops the server. (!stop_server)<br>
- `!restart_server` Restarts the server. (!restart_server)<br>
- `!initiate_restart` Initiates a restart. (!initiate_restart [minutes until restart])<br>
- `!abort_restart` Aborts an upcoming restart. Works both with restart schedule and manual initiated restart. (!abort_restart)<br>
- `!save_server` Saves the current world. (!save_server)<br>
- `!add_user` Adds a new user to the whitelist. (!add_user "[username]" "[password]")<br>
- `!add_user_to_whitelist` Adds a single user connected with a password to the whitelist. (!add_user_to_whitelist "[username]")<br>
- `!remove_user_from_white_list` Removes a single user connected with a password to the whitelist. (!remove_user_from_whitelist "[username]")<br>
- `!ban_steamid` Bans a Steam ID. (!ban_steamid [steam id])<br>
- `!unban_steamid` Unbans a Steam ID. (!unban_steamid [steam id])<br>
- `!ban_user` Bans a user. (!ban_user "[username]")<br>
- `!unban_user` Unbans a user. (!unbanuser "[username]")<br>
- `!make_admin` Gives admin rights to a user. (!make_admin "[username]")<br>
- `!remove_admin` Removes admin rights to a user. (!remove_admin "[username]")<br>
- `!kick_user` Kicks a user from the server. (!kick_user "[username]")<br>
- `!start_rain` Starts rain on the server. (!startrain)<br>
- `!stop_rain` Stops rain on the server. (!stoprain)<br>
- `!teleport` Teleports a player. (!teleport "[username1]" "[username2]") | Username 1 will be teleported to Username 2.<br>
- `!add_item` Gives an item to the player. (!add_item "[username]" "[module.item]")<br>
- `!add_xp` Gives XP to a player. (!addxp "[username]" "[perk]" [xp])<br>
- `!chopper` Places a helicopter event on a random player. (!chopper)<br>
- `!godmode` Makes a player invincible. (!godmode "[username]")<br>
- `!invisible` Makes a player invisible to zombies. (!invisible "[username]")<br>
- `!noclip` Allows a player to pass through solid objects. (!noclip "[username]")<br>
- `!server` - Server management (continued)
  - `whitelist add/remove <username>` - Manage whitelist
  - `mods list/enable/disable <modId>` - Manage server mods
  - `config <setting> <value>` - Update server settings
  - `save` - Force save world data
  - `clean` - Clean up server resources
  - `reset` - Reset world (requires confirmation)

### Server Configuration
- `!config` - Server configuration
  - `view` - Show current configuration
  - `set <option> <value>` - Update setting
  - `reload` - Reload configuration

### World Management
- `!world` - World management
  - `time <hour>` - Set world time
  - `weather <type>` - Set weather condition
  - `zombies <action>` - Manage zombie spawns
  - `safehouse <action>` - Manage safehouses

### Economy Commands
- `!economy` - Economy management
  - `give <player> <amount>` - Give points
  - `take <player> <amount>` - Remove points
  - `set <player> <amount>` - Set points
  - `reset` - Reset all points (requires confirmation)

### Channel Management
- `!channel` - Channel configuration
  - `public add/remove` - Set public command channels
  - `admin add/remove` - Set admin command channels
  - `log set` - Set logging channel

## Permission Levels
- **Player**: Basic commands
- **Moderator**: Player management
- **Admin**: Full server control
- **Owner**: Configuration access

## Support
For issues and feature requests, please create an issue on GitHub.

# Localization
You can find the default localization file in [here](https://github.com/yourusername/PZBotV/blob/main/localization/default.json). All you need to do is downloading it and translating the all words/sentences in the right side of **":"** between **two quote marks**. Example below will illustrate how it should look like after the translation.

**Before translation:**
```
{
  "gen_enab_up": "Enabled",
  "gen_disa_up": "Disabled",
  "gen_hours_text": "hour(s)",
  ...
  "warn_server_not_running": "Server is not running.",
  "warn_bot_conf_not_done": "Bot configuration haven't done yet.",
  ...
}
```

**After translation:**
```
{
  "gen_enab_up": "Aktif",
  "gen_disa_up": "Pasif",
  "gen_hours_text": "saat",
  ...
  "warn_server_not_running": "Server çalışmıyor.",
  "warn_bot_conf_not_done": "Bot ayarları henüz tamamlanmadı.",
  ...
}
```

**Warning:** 
There might be cases where you can see some weird expressions like `{log_file}`, `{current_version}`, `{state}` etc. These are special expressions that will be replaced with related value before displaying the text. Do **not** translate these. However, you can move them freely in a sentence and match them with your own language's sentence structure.

Some examples of how some of the expressions will look like after the related value replacement:
```
{day}/{month}/{year} -> 19/12/2022
{year}-{month}-{day} -> 2022-12-19

Bot Version: {version}  -> Bot Version: v1.8.0
Bot Version ({version}) -> Bot Version (v1.8.0)

Server auto start feature has been {state}.      -> Server auto start feature has been enabled.
Non-public mod logging feature has been {state}. -> Non-public mod logging feature has been disabled.

{hours} hours ago -> 10 hours ago
hours ago {hours} -> hours ago 10
```

After you have completed translating all words/sentences, please create an [issue](https://github.com/yourusername/PZBotV/issues/new/choose) by selecting the **Localization Submission** template with the title of `Localization of <language here>` and attaching the translated `.json` file in a **zip archive**. I will add it to available localizations. Also, when a new version of the bot released, there might be new added text so it is good to keep an eye on updates. If your current localization is missing the new added text, bot will use the default localization for these.

# Project Zomboid Discord Bot

## Description
A Discord bot for managing Project Zomboid servers with in-game account linking, points system, and comprehensive server management.

## Features
- Account linking through in-game verification
- Player statistics and points tracking
- Server management (restart, backup, monitoring)
- Wheelspin rewards system
- Admin controls and monitoring
- Public/Admin channel management
- Automated server restarts
- Server performance monitoring
- World management tools

## Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Configure `.env`:
```properties
DISCORD_TOKEN=your_discord_token
PREFIX=!
PZ_SERVER_HOST=your_server_host
PZ_SERVER_RCON_PORT=your_rcon_port
PZ_SERVER_RCON_PASSWORD=your_rcon_password
PZ_SERVER_PATH=your_server_path
```

## Commands
- `!stats`: Get player statistics
- `!health`: Get server health
- `!backup`: Backup the server
- `!togglePublicCommand`: Toggle public command access for a channel
- `!link`: Link your Steam account
- `!unlink`: Unlink your Steam account
- `!server <subcommand>`: Server management commands
  - `restart`: Restart the server
  - `schedule <times>`: Schedule server restarts
  - `kick <username>`: Kick a player
  - `ban <username> <reason>`: Ban a player
  - `whitelist <add|remove> <username>`: Manage whitelist
  - `status`: Get server status
  - `backup`: Create a server backup
  - `console <command>`: Execute a console command

### Public Commands
- `!link` - Link your game account to Discord
  - Usage: Type `!link` and follow DM instructions
- `!stats` - View your game statistics
  - Usage: `!stats` or `!stats <playername>`
- `!points` - Check your points balance
  - Usage: `!points`
- `!wheel` - Spin the reward wheel (costs points)
  - Usage: `!wheel`
- `!leaderboard` - View top players
  - Usage: `!leaderboard`
  - `!server` - View top players
  - Usage: `!server`

### Admin Commands
- `!server` - Server management
  - `restart` - Restart the server immediately
  - `schedule <time>` - Schedule automatic restarts
  - `backup` - Create server backup
  - `status` - View detailed server status
  - `kick <username>` - Kick player from server
  - `ban <username> <reason>` - Ban player with reason
  - `unban <username>` - Remove player ban
  - `whitelist <add|remove> <username>` - Manage whitelist
  - `config <setting> <value>` - Update server settings
  - `console <command>` - Execute RCON command
  - `whitelist add/remove <username>` - Manage whitelist
  - `mods list/enable/disable <modId>` - Manage server mods
  - `config <setting> <value>` - Update server settings
  - `save` - Force save world data
  - `clean` - Clean up server resources
  - `reset` - Reset world (requires confirmation)

### Server Configuration
- `!config` - Server configuration
  - `view` - Show current configuration
  - `set <option> <value>` - Update setting
  - `reload` - Reload configuration

### World Management
- `!world` - World management
  - `time <hour>` - Set world time
  - `weather <type>` - Set weather condition
  - `zombies <action>` - Manage zombie spawns
  - `safehouse <action>` - Manage safehouses

### Economy Commands
- `!economy` - Economy management
  - `give <player> <amount>` - Give points
  - `take <player> <amount>` - Remove points
  - `set <player> <amount>` - Set points
  - `reset` - Reset all points (requires confirmation)

### Channel Management
- `!channel` - Channel configuration
  - `public add/remove` - Set public command channels
  - `admin add/remove` - Set admin command channels
  - `log set` - Set logging channel

## Permission Levels
- **Player**: Basic commands
- **Moderator**: Player management
- **Admin**: Full server control
- **Owner**: Configuration access

## Support
For issues and feature requests, please create an issue on GitHub.

## License
MIT License - See LICENSE file for details
