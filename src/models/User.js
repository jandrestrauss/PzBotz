const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: { type: String, unique: true },
    steamId: { type: String, sparse: true },
    username: String,
    role: { type: String, default: 'user' },
    points: { type: Number, default: 0 },
    tickets: { type: Number, default: 0 },
    lastCommand: Date,
    joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
