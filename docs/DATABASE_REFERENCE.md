# Database Reference Guide

## Payment Tables

### Transactions
```sql
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    provider VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(20) NOT NULL,
    reference VARCHAR(100) UNIQUE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user ON payment_transactions(user_id);
CREATE INDEX idx_transactions_status ON payment_transactions(status);
CREATE INDEX idx_transactions_created ON payment_transactions(created_at);
```

### Points Ledger
```sql
CREATE TABLE points_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) NOT NULL,
    transaction_id UUID REFERENCES payment_transactions(id),
    points_change INTEGER NOT NULL,
    balance INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_points_user ON points_ledger(user_id);
CREATE INDEX idx_points_transaction ON points_ledger(transaction_id);
```
