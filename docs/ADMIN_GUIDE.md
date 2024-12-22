# Administrator Guide

## Payment Management Commands

### Transaction Commands
```
!transaction status <transaction_id> - Check transaction status
!transaction refund <transaction_id> - Process refund
!transaction list [user_id] - List transactions
!transaction verify <transaction_id> - Force verification
```

### Points Management
```
!points add <user_id> <amount> - Add points manually
!points remove <user_id> <amount> - Remove points
!points reset <user_id> - Reset user points
!points audit <user_id> - View points history
```

### System Maintenance
```
!payment status - Check payment system status
!payment maintenance [on|off] - Toggle maintenance mode
!payment reconcile - Force reconciliation
!payment providers - List provider status
```

## Security Levels

### Permission Tiers
1. Payment Admin (`PAYMENT_ADMIN`)
2. Points Manager (`POINTS_MANAGER`)
3. Transaction Viewer (`TXN_VIEWER`)
4. Support Staff (`SUPPORT`)

### Role Requirements
```javascript
const REQUIRED_ROLES = {
    PAYMENT_ADMIN: ['Administrator', 'Payment Manager'],
    POINTS_MANAGER: ['Administrator', 'Points Manager'],
    TXN_VIEWER: ['Administrator', 'Support Staff'],
    SUPPORT: ['Support Staff']
};
```
