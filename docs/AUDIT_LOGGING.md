# Audit Logging Guide

## Payment Audit Events

### Transaction Logs
```typescript
interface TransactionAudit {
    eventType: 'PAYMENT_INITIATED' | 'PAYMENT_COMPLETED' | 'PAYMENT_FAILED' | 'POINTS_CREDITED';
    userId: string;
    amount: number;
    timestamp: Date;
    metadata: {
        provider: 'paystack' | 'paygate';
        reference: string;
        status: string;
    }
}
```

### Critical Events
1. Payment Status Changes
2. Failed Transactions
3. Suspicious Activity
4. System Errors
5. Points Balance Updates

## Log Storage

### Database Structure
```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50),
    user_id VARCHAR(50),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Retention Policy
- Transaction Logs: 2 years
- Payment Events: 1 year
- System Events: 6 months
- Debug Logs: 30 days
