# Payment Validation Guide

## Validation Process

### Transaction Validation
```typescript
interface ValidationRule {
    name: string;
    validator: (transaction: Transaction) => boolean;
    errorMessage: string;
}

const VALIDATION_RULES: ValidationRule[] = [
    {
        name: 'amount',
        validator: (t) => t.amount >= 10 && t.amount <= 500000,
        errorMessage: 'Amount must be between 10 and 500,000 ZAR'
    },
    {
        name: 'currency',
        validator: (t) => t.currency === 'ZAR',
        errorMessage: 'Only ZAR currency is supported'
    }
];
```

### Security Checks
```javascript
const SECURITY_VALIDATIONS = {
    signature: {
        required: true,
        algorithm: 'sha512'
    },
    ipWhitelist: [
        '52.31.139.75',
        '52.49.173.169',
        '52.214.14.220'
    ],
    duplicateWindow: 3600 // seconds
};
```

## Reward Processing

### Points Calculation
```javascript
const POINTS_RULES = {
    conversionRate: 100, // points per ZAR
    minimumPoints: 1000,
    maximumPoints: 50000,
    bonusThresholds: [
        { amount: 5000, bonus: 500 },
        { amount: 10000, bonus: 1500 }
    ]
};
