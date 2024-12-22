# Developer Guide

## Introduction
This guide provides information for developers who want to contribute to the Project Zomboid Discord Bot.

## Prerequisites
- Node.js 16+
- MySQL
- Git

## Setup
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

## Project Structure
- `src/`: Source code
  - `commands/`: Command handlers
  - `database/`: Database integration and migrations
  - `logging/`: Logging system
  - `monitoring/`: Monitoring system
  - `websocket/`: WebSocket connection handling
  - `errorHandling/`: Error handling
  - `permissions/`: Permissions system
  - `localization/`: Localization system
  - `backup/`: Backup system
  - `rateLimiting/`: Rate limiting

## Contributing
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your fork.
5. Create a pull request to the main repository.

## Code Style
- Follow the existing code style.
- Use meaningful variable and function names.
- Write comments where necessary.

## Testing
- Write tests for new features and bugfixes.
- Run tests before submitting a pull request.

## Support
For any questions or issues, please create an issue on GitHub.

## License
This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
