import MetricsCollectorImpl from '../monitoring/MetricsCollector';
import NotificationService from './notifications/NotificationService';

class ErrorHandler {
    private metrics: MetricsCollectorImpl;
    private errorLog: Map<string, ErrorStats>;
    private notificationService: NotificationService;

    constructor() {
        this.metrics = new MetricsCollectorImpl();
        this.errorLog = new Map();
        this.notificationService = NotificationService.getInstance();
    }

    async handleError(error: Error, context: string) {
        const errorStats = this.updateErrorStats(error, context);
        await this.metrics.recordError(error, context);
        
        if (errorStats.frequency > 10) {
            await this.triggerAlarm(error, errorStats);
        }

        return this.determineRecoveryAction(errorStats);
    }

    private updateErrorStats(error: Error, context: string): ErrorStats {
        const key = `${context}:${error.name}`;
        const stats = this.errorLog.get(key) || {
            count: 0,
            firstSeen: new Date(),
            lastSeen: new Date(),
            frequency: 0
        };

        stats.count++;
        stats.lastSeen = new Date();
        stats.frequency = this.calculateFrequency(stats);
        
        this.errorLog.set(key, stats);
        return stats;
    }

    private calculateFrequency(stats: ErrorStats): number {
        const timeSpan = stats.lastSeen.getTime() - stats.firstSeen.getTime();
        return (stats.count / timeSpan) * 1000 * 60; // errors per minute
    }

    private async triggerAlarm(error: Error, stats: ErrorStats) {
        const alarm = {
            type: 'error_frequency',
            error: error.name,
            frequency: stats.frequency,
            context: error.stack,
            timestamp: new Date()
        };
        
        await this.notificationService.send(alarm);
    }

    private determineRecoveryAction(stats: ErrorStats) {
        if (stats.frequency > 20) {
            return 'service_restart';
        } else if (stats.frequency > 15) {
            return 'clear_cache';
        } else if (stats.frequency > 10) {
            return 'log_only';
        }
        return 'monitor';
    }
}

interface ErrorStats {
    count: number;
    firstSeen: Date;
    lastSeen: Date;
    frequency: number;
}

export default ErrorHandler;
