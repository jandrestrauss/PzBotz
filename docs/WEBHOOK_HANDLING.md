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
