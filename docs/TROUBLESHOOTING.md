# Troubleshooting Guide

## Common Issues and Solutions

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

## Support Resources

- Discord Support Server: [Join Here]
- GitHub Issues: [Report Bug]
- Documentation: [View Docs]
