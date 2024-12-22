# Database Schema Guide

## Transaction Schema
```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(50) UNIQUE,
    user_id VARCHAR(50),
    amount DECIMAL(10,2),
    currency VARCHAR(3),
    status VARCHAR(20),
    provider VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
```

## Points Schema
```sql
CREATE TABLE points_balance (
    user_id VARCHAR(50) PRIMARY KEY,
    points INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE points_history (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50),
    amount INTEGER,
    transaction_id INTEGER REFERENCES transactions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Webhook Events Schema
```sql
CREATE TABLE webhook_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50),
    payload JSONB,
    status VARCHAR(20),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhook_status ON webhook_events(status);
```
