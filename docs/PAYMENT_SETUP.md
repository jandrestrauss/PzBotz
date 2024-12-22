# Payment Integration Guide

## Payment Providers

### PayGate Setup

#### Requirements
1. PayGate Merchant Account
2. Valid SSL Certificate
3. Supported Currency: ZAR (South African Rand)
4. Secure Payment Endpoint

#### Environment Variables
```env
PAYGATE_ENDPOINT=https://secure.paygate.co.za/payweb3/process.trans
PAYGATE_MERCHANT_ID=your_merchant_id
PAYGATE_MERCHANT_KEY=your_merchant_key
PAYGATE_RETURN_URL=https://your-server.com/payment/return
PAYGATE_NOTIFY_URL=https://your-server.com/payment/notify
```

#### Payment Flow
1. User selects points package
2. System generates payment request
3. User redirected to PayGate
4. Payment processed
5. System verifies payment
6. Points awarded to user

#### Security Measures
- Checksum verification
- SSL/TLS encryption
- Payment verification
- Transaction logging
- Error handling

#### Testing
```bash
# Test card details
Card Number: 4000000000000002
CVV: 999
Expiry: Any future date
```

### Paystack Setup

#### Requirements
1. Paystack Business Account
2. API Keys (Secret and Public)
3. Supported Currency: ZAR (South African Rand)
4. Valid SSL Certificate

#### Environment Variables
```env
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_CALLBACK_URL=https://your-server.com/payment/callback
```

#### Payment Flow
1. User selects points package
2. System initializes Paystack transaction
3. User redirected to Paystack checkout
4. Payment processed
5. System verifies transaction
6. Points awarded on success

#### Features
- Email receipt generation
- Bank list integration
- Refund support
- Metadata tracking
- Transaction verification

#### Testing
```bash
# Test card details
Card Number: 4084084084084081
CVV: 408
Expiry: Any future date
Pin: 0000
OTP: 123456
```

#### Test Environment
```env
# Test Mode Credentials
PAYSTACK_MODE=test
PAYSTACK_TEST_SECRET_KEY=sk_test_xxxxx
PAYSTACK_TEST_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_TEST_WEBHOOK_URL=https://your-ngrok-url.ngrok.io/webhook/paystack

# Test Card Details
# Success scenarios
CARD_NUMBER=4084084084084081
CVV=408
EXPIRY=12/25
PIN=0000
OTP=123456

# Failed transaction scenarios
FAILED_CARD_OTP=222666
```

#### Validation Rules
- Minimum transaction: ZAR 10.00
- Maximum transaction: ZAR 500,000.00
- Supported cards: Visa, Mastercard
- Required fields: email, amount, currency
- Webhook signature verification required

## Transaction Management

### Statuses
- `pending`: Payment initiated
- `processing`: Payment in progress
- `completed`: Payment successful
- `failed`: Payment failed
- `refunded`: Payment refunded

### Error Handling
1. Payment Timeout
2. Network Issues
3. Validation Errors
4. Currency Conversion
5. Transaction Limits

## Support
- PayGate Support: support@paygate.co.za
- Documentation: https://docs.paygate.co.za/
- Test Environment: https://secure.paygate.co.za/payweb3/test
