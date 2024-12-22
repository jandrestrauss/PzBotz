const mongoose = require('mongoose');

const serverConfigSchema = new mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    port: { type: Number, required: true },
    maxPlayers: { type: Number, default: 32 },
    mods: [{
        workshopId: String,
        name: String,
        required: Boolean
    }],
    backupSchedule: String,
    settings: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('ServerConfig', serverConfigSchema);
