# Project Zomboid Discord Bot

## Description
A Discord bot for managing Project Zomboid servers, providing player statistics, server health, and more.

## Features
- Player statistics
- Server health monitoring
- Server backup
- Public and admin command toggling
- Greeting new members

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the following content:
    ```properties
    DISCORD_TOKEN=your_discord_token
    PREFIX=!
    PZ_SERVER_HOST=your_server_host
    PZ_SERVER_RCON_PORT=your_rcon_port
    PZ_SERVER_RCON_PASSWORD=your_rcon_password
    ```
4. Start the bot: `npm start`

## Commands
- `!stats`: Get player statistics
- `!health`: Get server health
- `!backup`: Backup the server
- `!togglePublicCommand`: Toggle public command access for a channel

## License
MIT

# Code Citations

## License: unknown
https://github.com/daadyrbarn/daadyrbarn.github.io/tree/cf076ac9391278715fe87e4057ed9b1c05598943/piplup-bot/index.js

```
).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
```


## License: unknown
https://github.com/itsayushch/create-discord.js-app/tree/17d08eb2c7f454b36207f04592c2e4044b2a6731/templates/js-bot-plain/index.js

```
.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands
```


## License: unknown
https://github.com/Zakirov97/JSProjects/tree/371fc7a8ca34c273e064f61f64f010249063bab9/LonelyBot/index.js

```
(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

/
```


## License: MIT
https://github.com/hightechu/academy-scheduhealth-bot/tree/d72532ec2d822f198c8c1512be005c4ae2a1b463/index.js

```
=> file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (.
```


## License: unknown
https://github.com/AogiriBling/kahoot-raider-discord-bot/tree/8f0247812e47609a755b6467699c8b7f00311ebe/index.js

```
.filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
```

