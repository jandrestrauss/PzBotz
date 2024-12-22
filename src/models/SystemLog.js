const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    level: { type: String, enum: ['info', 'warn', 'error'], required: true },
    message: { type: String, required: true },
    source: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metadata: mongoose.Schema.Types.Mixed
});

// Index for quick querying of recent logs
systemLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('SystemLog', systemLogSchema);
