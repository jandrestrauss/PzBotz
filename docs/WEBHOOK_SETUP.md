# Webhook Setup Guide

## Supported Webhook Events

### Payment Events
- `payment.success`
- `payment.failed`
- `payment.pending`
- `payment.refunded`

### Server Events
- `server.starting`
- `server.stopping`
- `server.crash`
- `mod.update`

## Webhook Security
1. Signature Verification
2. IP Whitelisting
3. Rate Limiting
4. Timeout Handling

## Implementation Example

```javascript
// Paystack Webhook Handler
app.post('/webhook/paystack', async (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  const isValid = verifySignature(signature, req.body);
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.body;
  await handlePaystackEvent(event);
  
  res.status(200).send('Webhook processed');
});
```

## Configuration
```json
{
  "webhooks": {
    "endpoints": {
      "paystack": "/webhook/paystack",
      "paygate": "/webhook/paygate",
      "discord": "/webhook/discord"
    },
    "security": {
      "requireSignature": true,
      "ipWhitelist": [
        "52.31.139.75",
        "52.49.173.169",
        "52.214.14.220"
      ]
    }
  }
}
