const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    steamId: { type: String, required: true, unique: true },
    discordId: { type: String, sparse: true },
    username: { type: String, required: true },
    firstJoin: { type: Date, default: Date.now },
    lastJoin: Date,
    lastLeave: Date,
    playtime: { type: Number, default: 0 },
    online: { type: Boolean, default: false },
    banned: { type: Boolean, default: false },
    banReason: String,
    warnings: [{
        reason: String,
        date: Date,
        issuedBy: String
    }]
});

playerSchema.methods.updatePlaytime = function() {
    if (this.lastJoin && this.lastLeave) {
        this.playtime += (this.lastLeave - this.lastJoin) / 1000;
    }
};

module.exports = mongoose.model('Player', playerSchema);
