# User Guide - Payment Features

## Discord Commands

### Points Balance
```
!points - Check your current points balance
!points history - View points transaction history
!points transfer <user> <amount> - Transfer points to another user
```

### Purchase Points
```
!shop - View available point packages
!buy <package_id> - Purchase points package
!transactions - View your transaction history
```

### Payment Process
1. Select package using `!buy` command
2. Click payment link sent via DM
3. Complete payment on provider's page
4. Receive confirmation in Discord
5. Points credited automatically

## Payment Commands

### Quick Purchase
```
!buy small   - Buy small points package (1000 points)
!buy medium  - Buy medium points package (2500 points)
!buy large   - Buy large points package (5000 points)
!buy custom <amount> - Buy custom amount of points
```

### Transaction Management
```
!payment status <txn_id> - Check your transaction status
!payment cancel <txn_id> - Cancel pending transaction
!payment receipt <txn_id> - Get transaction receipt
```

### Support Commands
```
!payment help - Show payment help
!payment support - Create support ticket
!payment methods - List payment methods
```

## Troubleshooting

### Common Issues
1. Payment Declined
   - Verify card details
   - Check available funds
   - Ensure card supports online transactions

2. Points Not Received
   - Wait 5 minutes for processing
   - Check transaction status with `!transactions`
   - Contact support if issues persist
