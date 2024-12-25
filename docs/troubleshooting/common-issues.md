# Common Issues

## Connection Problems

### RCON Connection Failed
```log
Error: ECONNREFUSED (Connection refused)
```
**Solution:**
1. Check RCON port in server settings
2. Verify firewall rules
3. Test connection:
```bash
npm run test:rcon
```

### Discord Bot Offline
**Solution:**
1. Check bot_token.txt
2. Verify bot permissions
3. Check logs:
```bash
tail -f logs/error.log
```

## Performance Issues

### High CPU Usage
**Symptoms:**
- Slow command response
- Delayed updates

**Solution:**
1. Check monitoring dashboard
2. Reduce monitoring intervals
3. Clear old logs
