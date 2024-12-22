# Configuration Setup Guide

## Core Configuration
// ...existing core config sections...

## Payment Configuration

### Required Settings
```json
{
  "payment": {
    "enabled": true,
    "providers": ["paygate", "paystack"],
    "defaultProvider": "paystack",
    "pointsPackages": [
      {
        "id": "basic",
        "points": 1000,
        "price": 10.00,
        "currency": "ZAR"
      },
      {
        "id": "premium",
        "points": 5000,
        "price": 45.00,
        "currency": "ZAR"
      }
    ],
    "webhookSecret": "your_webhook_secret",
    "successRedirect": "https://your-server.com/success",
    "failureRedirect": "https://your-server.com/failure"
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
