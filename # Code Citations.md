# Code Citations

## License: unknown
https://github.com/pokerface139/AndyBot/tree/c08506805f751e98f5c9ed372347e1360ac31d8f/src/andybot.js

```
('message', async message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/)
```


## License: unknown
https://github.com/Sneawy/reakbot/tree/461c2e037efb52da5f3f61c1554d6bb94a06e876/index.js

```
startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command
```


## License: unknown
https://github.com/Hasnainzxc/Mid-Journey-Personal-Assistant-bot/tree/3f59211d1285098cd8bde59e37131e7e9010e854/.history/commands/gpt/ting_20230505014007.js

```
async message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args
```

## RCON Configuration

```json
{
    "rcon": {
        "host": "your.server.ip",
        "port": 27015,
        "password": "your_rcon_password"
    }
}
```

