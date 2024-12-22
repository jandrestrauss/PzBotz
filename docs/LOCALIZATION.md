# Localization Guide

## Payment Strings

### Transaction Messages
```json
{
  "payment": {
    "success": {
      "title": "Payment Successful",
      "description": "Your payment of {amount} {currency} was successful"
    },
    "failed": {
      "title": "Payment Failed",
      "description": "Your payment of {amount} {currency} failed: {reason}"
    },
    "pending": {
      "title": "Payment Processing",
      "description": "Your payment is being processed"
    }
  },
  "points": {
    "awarded": "You have been awarded {points} points",
    "insufficient": "Insufficient points balance",
    "transfer_success": "Successfully transferred {points} points to {user}"
  }
}
```

### Error Messages
```json
{
  "errors": {
    "invalid_amount": "Invalid payment amount",
    "currency_not_supported": "Currency {currency} is not supported",
    "payment_timeout": "Payment request timed out",
    "verification_failed": "Payment verification failed"
  }
}
```

## Supported Languages
1. English (en)
2. Afrikaans (af)
3. Zulu (zu)
4. Xhosa (xh)
