# Webhook Handling Guide

## Webhook Endpoints

### Payment Webhooks
```javascript
const WEBHOOK_ENDPOINTS = {
    PAYSTACK_TRANSACTION: '/webhook/paystack/transaction',
    PAYSTACK_TRANSFER: '/webhook/paystack/transfer',
    PAYGATE_NOTIFY: '/webhook/paygate/notify'
};
```

## Security Implementation
```javascript
const SECURITY_CONFIG = {
    signatureHeader: 'x-paystack-signature',
    ipWhitelist: [
        '52.31.139.75',
        '52.49.173.169',
        '52.214.14.220'
    ],
    timeoutMS: 10000
};
```

## Implementation Details

### Signature Verification
```csharp
public class SignatureVerifier
{
    private readonly string secretKey;
    private const string HASH_ALGORITHM = "HMACSHA512";
    
    public bool VerifySignature(string payload, string signature)
    {
        // Implementation details available in WebhookHandler.cs
    }
}
```

### Event Processing
```typescript
interface WebhookProcessor {
    validateEvent: (event: PaymentEvent) => Promise<boolean>;
    processEvent: (event: PaymentEvent) => Promise<void>;
    handleError: (error: Error) => Promise<void>;
}
```

### Security Measures
```javascript
const WEBHOOK_SECURITY = {
    rateLimiting: {
        maxRequests: 100,
        windowMs: 60000
    },
    ipFiltering: true,
    signatureRequired: true,
    timeoutMs: 10000
};
```

## Event Types

### Transaction Events
- `charge.success`
- `charge.failed`
- `transfer.success`
- `transfer.failed`
- `refund.processed`

### Response Format
```javascript
{
    status: 200,
    message: 'Webhook processed successfully',
    reference: 'TXN_123456789',
    timestamp: '2024-01-20T15:30:00Z'
}
```

## Error Handling
1. Invalid Signature
2. Request Timeout
3. Invalid Payload
4. Database Errors
5. Network Issues
