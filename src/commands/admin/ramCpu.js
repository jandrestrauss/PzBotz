const Command = require('../base/Command');
const os = require('os');

class RamCpuCommand extends Command {
    constructor() {
        super('get_ram_cpu', 'Gets the total RAM and CPU usage of the machine');
    }

    async execute(message) {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memoryUsage = ((usedMem / totalMem) * 100).toFixed(2);

        const cpuUsage = os.loadavg()[0].toFixed(2);

        return message.reply(`System Resource Usage:
RAM: ${memoryUsage}% (${Math.round(usedMem / 1024 / 1024)}MB / ${Math.round(totalMem / 1024 / 1024)}MB)
CPU Load: ${cpuUsage}%`);
    }
}

module.exports = new RamCpuCommand();
