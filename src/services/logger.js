class EnhancedLogger {
    constructor() {
        this.logStore = new LogStore();
        this.metrics = new MetricsCollector();
    }

    debug(msg, meta = {}) {
        this.log('debug', msg, meta);
    }

    info(msg, meta = {}) {
        this.log('info', msg, meta);
    }

    warn(msg, meta = {}) {
        this.log('warn', msg, meta);
    }

    error(msg, meta = {}) {
        this.log('error', msg, meta);
        this.metrics.recordError(meta);
    }

    critical(msg, meta = {}) {
        this.log('critical', msg, meta);
        this.metrics.recordCritical(meta);
        this.alertOperators(msg, meta);
    }

    async log(level, msg, meta) {
        await this.logStore.write({
            timestamp: new Date(),
            level,
            message: msg,
            metadata: meta,
            context: this.getCurrentContext()
        });
    }
}
