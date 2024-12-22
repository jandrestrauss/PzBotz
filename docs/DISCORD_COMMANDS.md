# Discord Commands Guide

## Payment Commands

### User Commands
```typescript
interface PaymentCommand {
    name: string;
    description: string;
    usage: string;
    examples: string[];
    permissions: string[];
}

const PAYMENT_COMMANDS: PaymentCommand[] = [
    {
        name: 'buy',
        description: 'Purchase points package',
        usage: '!buy <package|amount>',
        examples: ['!buy small', '!buy 1000'],
        permissions: ['USER']
    },
    {
        name: 'points',
        description: 'Check points balance',
        usage: '!points [history|transfer]',
        examples: ['!points', '!points history'],
        permissions: ['USER']
    }
];
```

### Admin Commands
```typescript
const ADMIN_COMMANDS: PaymentCommand[] = [
    {
        name: 'payment',
        description: 'Payment system management',
        usage: '!payment <status|maintenance|reconcile>',
        examples: ['!payment status', '!payment maintenance on'],
        permissions: ['PAYMENT_ADMIN']
    },
    {
        name: 'points-manage',
        description: 'Points management',
        usage: '!points-manage <add|remove|reset> <user_id> [amount]',
        examples: ['!points-manage add @user 1000'],
        permissions: ['POINTS_MANAGER']
    }
];
