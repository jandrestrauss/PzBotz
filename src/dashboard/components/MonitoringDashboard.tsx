import React, { useEffect, useState } from 'react';
import MetricsCollectorImpl from '../../monitoring/MetricsCollector';
import { MetricReport } from '../../monitoring/types';
import SystemMetrics from './SystemMetrics';
import ErrorList from './ErrorList';
import { RecoveryStatus } from './RecoveryStatus';
import { PerformanceGraph } from '../graphs/PerformanceGraph';

const MonitoringDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<MetricReport | null>(null);
    const [errors, setErrors] = useState<any[]>([]);
    const [isRecovering, setIsRecovering] = useState(false);
    const [lastError, setLastError] = useState<string>();
    const [recoveryAttempts, setRecoveryAttempts] = useState(0);

    useEffect(() => {
        const metricsCollector = new MetricsCollectorImpl();
        const interval = setInterval(async () => {
            const latestMetrics = await metricsCollector.collect();
            // Ensure the metrics object includes the players property
            if (latestMetrics && !latestMetrics.metrics.players) {
                latestMetrics.metrics.players = 0; // or any default value
            }
            // Ensure the metrics object includes the analysis property
            if (latestMetrics && !latestMetrics.analysis) {
                latestMetrics.analysis = { trend: false, anomaly: false, forecast: false }; // or any default values
            }
            setMetrics(latestMetrics);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="monitoring-dashboard">
            <SystemMetrics data={metrics?.metrics} />
            <ErrorList errors={errors} />
            <RecoveryStatus 
                isRecovering={isRecovering}
                lastError={lastError}
                recoveryAttempts={recoveryAttempts}
            />
            <PerformanceGraph data={metrics} />
        </div>
    );
};

export default MonitoringDashboard;
