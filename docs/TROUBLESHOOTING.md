# Troubleshooting Guide

## Common Issues

### Bot Connection
```bash
# Check bot token
cat bot_token.txt
# Verify permissions in Discord
# Review logs
tail -f logs/app.log
```

### RCON Issues
```bash
# Test RCON connection
npm run test:rcon
# Check server status
npm run server:status
```

### Performance Problems
1. High CPU Usage
   - Check monitoring dashboard
   - Review active tasks
   - Analyze log patterns

2. Memory Leaks
   - Use monitoring tools
   - Check heap usage
   - Review service states

## Error Codes
| Code | Description | Solution |
|------|-------------|----------|
| E001 | Token Invalid | Regenerate token |
| E002 | RCON Failed | Check credentials |
| E003 | Backup Failed | Check permissions |

## Common Issues

### Bot Not Responding
1. Check bot token
2. Verify Discord permissions
3. Check channel configurations
4. Review log files

### Connection Issues
1. RCON Connection Failures
   ```bash
   Error: ECONNREFUSED
   ```
   **Solution:**
   - Verify RCON credentials in .env
   - Check server firewall settings
   - Confirm server is running
   - Test RCON connection manually using:
     ```bash
     npm run test:rcon
     ```

2. WebSocket Disconnects
   **Solution:**
   - Check network stability
   - Verify WebSocket configuration
   - Review connection logs:
     ```bash
     tail -f logs/websocket.log
     ```

3. Redis Connection Issues
   **Solution:**
   - Verify Redis is running:
     ```bash
     redis-cli ping
     ```
   - Check Redis configuration
   - Clear Redis cache if needed:
     ```bash
     redis-cli flushall
     ```

### RCON Connection Failed
```log
Error: RCON connection failed
```
Solutions:
1. Verify RCON password
2. Check server firewall
3. Confirm server is running

### Points Sync Issues
```log
Points mismatch detected
```
Solutions:
1. Check game server connection
2. Verify player data
3. Run manual sync: `!sync_points`

### Performance Issues

1. High Memory Usage
   **Symptoms:**
   - Bot becoming unresponsive
   - Slow command responses
   
   **Solution:**
   - Check memory leaks:
     ```bash
     npm run diagnose:memory
     ```
   - Restart bot service
   - Review resource intensive operations

2. Command Timeouts
   **Solution:**
   - Increase timeout values
   - Check server load
   - Review command queue

3. Database Lag
   **Solution:**
   - Optimize queries
   - Check indexes
   - Monitor connection pool

- High CPU Usage:
  1. Check server load
  2. Review backup schedule
  3. Adjust monitoring intervals

- Memory Leaks:
  1. Check log files
  2. Restart bot service
  3. Update Node.js

## New Scenarios

### WebSocket Connection Issues
- **Problem**: WebSocket connection is unstable.
- **Solution**: Ensure the WebSocket server is running and check network stability.

### API Rate Limiting
- **Problem**: API requests are being rate limited.
- **Solution**: Reduce the frequency of API requests or increase the rate limit in the configuration.

### Error Handling
- **Problem**: Errors are not being handled properly.
- **Solution**: Review the error handling logic and ensure all edge cases are covered.

## Error Codes Reference

| Code | Description | Solution |
|------|-------------|----------|
| E001 | RCON Auth Failed | Check credentials |
| E002 | Redis Connection Lost | Verify Redis service |
| E003 | Command Rate Limit | Wait and retry |
| E004 | Invalid Permission | Check user roles |

## Diagnostic Commands

1. Check Bot Status
   ```bash
   npm run status
   ```

2. Test Components
   ```bash
   npm run test:connections
   npm run test:permissions
   npm run test:cache
   ```

3. View Logs
   ```bash
   npm run logs:bot
   npm run logs:websocket
   npm run logs:commands
   ```

## Log Files
Location: `logs/`
- `app.log` - General application logs
- `error.log` - Error messages
- `debug.log` - Debug information

## Recovery Procedures

1. Bot Crash Recovery
   ```bash
   npm run recover
   ```

2. Database Recovery
   ```bash
   npm run db:repair
   ```

3. Cache Reset
   ```bash
   npm run cache:clear
   ```

## Recovery Steps
1. Stop bot: `Ctrl+C`
2. Clear temporary files
3. Restart bot: `npm start`

## Support Resources

- Discord Support Server: [Join Here]
- GitHub Issues: [Report Bug]
- Documentation: [View Docs]

## Support
Create GitHub issue with:
1. Log files
2. Configuration (sanitized)
3. Steps to reproduce
