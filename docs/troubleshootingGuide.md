# Troubleshooting Guide

## Common Issues

### Bot Not Responding
- **Check Permissions**: Ensure the bot has the necessary permissions to read and send messages in the channel.
- **Check Intents**: Ensure all required intents are enabled in the Discord developer portal.
- **Check Token**: Ensure the bot token is correctly set in the `.env` file.

### Database Connection Issues
- **Check Configuration**: Ensure the database configuration in the `.env` file is correct.
- **Check Database Status**: Ensure the MySQL server is running and accessible.

### WebSocket Connection Issues
- **Check Server**: Ensure the WebSocket server is running and accessible.
- **Check Logs**: Check the logs for any error messages related to WebSocket connections.

### High CPU/Memory Usage
- **Check Metrics**: Use the advanced metrics collection to monitor CPU and memory usage.
- **Optimize Code**: Review the code for any performance bottlenecks and optimize as needed.

## Logs
Check the logs for detailed error messages and stack traces. Logs are stored in the `logs` directory and rotated daily.

## Support
For any questions or issues, please create an issue on GitHub.

## License
This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
