# Configuration Setup Guide

## Core Configuration
// ...existing core config sections...

## Payment System Configuration

### Provider Settings
```json
{
  "payment": {
    "activeProviders": ["paystack", "paygate"],
    "defaultProvider": "paystack",
    "testMode": true,
    "webhookTimeout": 30000,
    "maxRetries": 3
  }
}
```

### Points Configuration
```json
{
  "points": {
    "packages": [
      {
        "id": "basic",
        "name": "Basic Package",
        "points": 1000,
        "price": 10.00
      },
      {
        "id": "premium",
        "name": "Premium Package",
        "points": 5000,
        "price": 45.00
      }
    ],
    "transferEnabled": true,
    "minTransfer": 100,
    "maxTransfer": 10000
  }
}
```

### Notification Settings
```json
{
  "notifications": {
    "paymentSuccess": {
      "discord": true,
      "email": false,
      "inGame": true
    },
    "paymentFailed": {
      "discord": true,
      "email": true,
      "inGame": false
    }
  }
}
```

### Environment Variables
```env
# Payment Gateway Settings
PAYMENT_ENABLED=true
DEFAULT_PROVIDER=paystack

# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_WEBHOOK_SECRET=whsec_xxxxx

# PayGate Configuration
PAYGATE_ID=xxxxx
PAYGATE_SECRET=xxxxx
```

## Analytics Configuration

### Tracking Settings
```json
{
  "analytics": {
    "enabled": true,
    "providers": ["internal", "discord"],
    "tracking": {
      "transactions": true,
      "userBehavior": true,
      "errorRates": true
    },
    "reporting": {
      "dailySummary": true,
      "weeklyReport": true,
      "monthlyAnalysis": true
    }
  }
}
```

### Metric Collection
```json
{
  "metrics": {
    "sampling": {
      "interval": 300,
      "retention": {
        "raw": "7d",
        "aggregated": "90d"
      }
    },
    "alerting": {
      "errorRate": 5,
      "responseTime": 2000,
      "failureThreshold": 3
    }
  }
}
```
