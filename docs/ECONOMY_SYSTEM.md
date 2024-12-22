# Economy System Documentation

## Points System

### Earning Points
- Player kills: 10 points
- Zombie kills: 1 point
- Time played: 1 point per minute
- Special events: Variable points

### Point Values
```javascript
const POINT_VALUES = {
    PLAYER_KILL: 10,
    ZOMBIE_KILL: 1,
    TIME_PLAYED: 1,
    EVENT_COMPLETION: 50
};
```

### Shop System
- Items available for purchase
- Wheel spin tickets
- Special permissions
- Custom items

## Administration

### Point Management
```bash
!addpoints <user> <amount>    # Add points to user
!removepoints <user> <amount> # Remove points from user
!setpoints <user> <amount>    # Set user's points
!checkpoints <user>          # Check user's points
```

### Shop Management
```bash
!addshopitem <name> <price>   # Add item to shop
!removeshopitem <name>        # Remove item from shop
!updateprice <item> <price>   # Update item price
!disableitem <item>          # Disable item temporarily
```

## Transaction Logging
All transactions are logged with:
- Timestamp
- User ID
- Action type
- Amount
- Current balance
