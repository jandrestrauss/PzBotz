# Installation Guide

## Prerequisites
- Node.js 16+
- MySQL
- Git

## Installation Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/PZBotV.git
    cd PZBotV
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure environment variables:
    ```env
    DISCORD_TOKEN=your_discord_token
    PREFIX=!
    PZ_SERVER_HOST=your_server_host
    PZ_SERVER_RCON_PORT=your_rcon_port
    PZ_SERVER_RCON_PASSWORD=your_rcon_password
    PZ_SERVER_PATH=your_server_path
    ```
4. Run migrations:
    ```bash
    npm run migrate
    ```
5. Start the application:
    ```bash
    npm start
    ```

## Configuration
Update the `.env` file with your specific configuration details:
- `DISCORD_TOKEN`: Your Discord bot token
- `PREFIX`: Command prefix for the bot
- `PZ_SERVER_HOST`: Hostname or IP address of your Project Zomboid server
- `PZ_SERVER_RCON_PORT`: RCON port of your Project Zomboid server
- `PZ_SERVER_RCON_PASSWORD`: RCON password of your Project Zomboid server
- `PZ_SERVER_PATH`: Path to your Project Zomboid server

## Running the Bot
To run the bot, use the following command:
```bash
npm start
```

## Troubleshooting
If you encounter any issues, please check the logs for error messages and refer to the [troubleshooting guide](troubleshootingGuide.md).

## Support
For any questions or issues, please create an issue on GitHub.

## License
This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
