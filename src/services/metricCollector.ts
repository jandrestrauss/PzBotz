import * as os from 'os';
import { EventEmitter } from 'events';

export interface SystemMetrics {
    cpuLoad: number;
    memoryUsage: number;
    uptime: number;
}

export class MetricCollector extends EventEmitter {
    collectMetrics(): SystemMetrics {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const loadAvg = os.loadavg()[0];

        const metrics = {
            cpuLoad: Math.max(0, loadAvg),
            memoryUsage: totalMem > 0 ? Math.min(100, Math.max(0, (1 - freeMem / totalMem) * 100)) : 0,
            uptime: os.uptime()
        };

        this.emit('metricsCollected', metrics);
        return metrics;
    }
}
