const mongoose = require('mongoose');

const serverStatsSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    players: {
        online: Number,
        peak: Number,
        unique: Number
    },
    performance: {
        cpu: Number,
        memory: Number,
        disk: Number,
        uptime: Number
    },
    events: [{
        type: String,
        description: String,
        timestamp: Date
    }],
    backups: [{
        filename: String,
        size: Number,
        timestamp: Date,
        status: String
    }]
});

serverStatsSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ServerStats', serverStatsSchema);
