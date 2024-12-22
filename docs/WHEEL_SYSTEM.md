# Wheel System Documentation

## Overview
The wheel system provides an engaging way for players to earn in-game items using tickets purchased with points.

## Wheel Types

### Default Wheel
- Standard items and vehicles
- 500 points per spin
- Common to rare items
- Vehicle chance: 10%

### Premium Wheel
- High-value items only
- 1000 points per spin
- Rare to legendary items
- Vehicle chance: 25%

## Reward Categories
1. Vehicles
   - Cars
   - Military Vehicles
   - Special Vehicles (helicopter)

2. Weapons & Tools
   - Military Grade
   - Special Tools
   - Rare Equipment

3. Resources
   - Building Materials
   - Medical Supplies
   - Ammunition

## Administration
```javascript
// Wheel Management Commands
!setwheel default     // Set default wheel
!setwheel premium     // Set premium wheel
!addwheelitem        // Add new item to wheel
!removewheelitem     // Remove item from wheel
!viewwheelstats      // View wheel statistics
```

## Configuration Options
- Ticket prices
- Win rates
- Item categories
- Cooldown periods
