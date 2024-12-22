# API Specification Guide

## Payment Endpoints

### Transaction API
```typescript
interface TransactionEndpoints {
    CREATE: {
        path: '/api/v1/transaction/create',
        method: 'POST',
        body: {
            amount: number;
            currency: string;
            userId: string;
            packageId?: string;
        }
    };
    VERIFY: {
        path: '/api/v1/transaction/verify/:reference',
        method: 'GET'
    };
    REFUND: {
        path: '/api/v1/transaction/refund',
        method: 'POST',
        body: {
            transactionId: string;
            reason: string;
        }
    }
}
```

### Points API
```typescript
interface PointsEndpoints {
    BALANCE: {
        path: '/api/v1/points/balance/:userId',
        method: 'GET'
    };
    TRANSFER: {
        path: '/api/v1/points/transfer',
        method: 'POST',
        body: {
            fromUserId: string;
            toUserId: string;
            amount: number;
        }
    }
}
```

## Provider-Specific Endpoints

### Paystack Routes
```typescript
interface PaystackEndpoints {
    INITIALIZE: {
        path: '/api/v1/paystack/initialize',
        method: 'POST',
        body: {
            amount: number;
            email: string;
            metadata?: object;
        }
    };
    CALLBACK: {
        path: '/api/v1/paystack/callback',
        method: 'GET',
        query: {
            reference: string;
            trxref: string;
        }
    }
}
```

### PayGate Routes
```typescript
interface PayGateEndpoints {
    INITIATE: {
        path: '/api/v1/paygate/initiate',
        method: 'POST',
        body: {
            amount: number;
            reference: string;
        }
    };
    NOTIFY: {
        path: '/api/v1/paygate/notify',
        method: 'POST'
    }
}
```

## Response Formats

### Success Response
```json
{
    "status": "success",
    "data": {
        "transactionId": "TXN_123",
        "amount": 100.00,
        "points": 1000
    }
}
```

### Error Response
```json
{
    "status": "error",
    "error": {
        "code": "ERR_001",
        "message": "Invalid amount"
    }
}
```
