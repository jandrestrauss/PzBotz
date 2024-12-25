# Diagnostic Tools Guide

## Health Check Commands
```bash
# Service Status
npm run health:check

# Connection Tests
npm run test:connections

# Performance Check
npm run diagnose:performance
```

## Log Analysis
```bash
# Recent Errors
npm run logs:errors

# Performance Issues
npm run logs:performance

# Security Events
npm run logs:security
```

## Recovery Procedures
1. Service Recovery
```bash
npm run recover:service <serviceName>
```

2. Cache Recovery
```bash
npm run cache:clear
npm run cache:rebuild
```

3. Emergency Shutdown
```bash
npm run emergency:shutdown
```
