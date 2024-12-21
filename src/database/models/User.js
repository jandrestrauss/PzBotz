const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true
    },
    gameAccounts: [{
        accountName: String,
        steamId: String,
        lastSeen: Date
    }],
    stats: {
        points: { type: Number, default: 0 },
        tickets: { type: Number, default: 0 },
        playtime: { type: Number, default: 0 },
        kills: { type: Number, default: 0 }
    },
    inventory: [{
        itemId: String,
        quantity: Number,
        acquired: { type: Date, default: Date.now }
    }],
    permissions: {
        role: { type: String, default: 'user' },
        customPermissions: [String]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('User', userSchema);
