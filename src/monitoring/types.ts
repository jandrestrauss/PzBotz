export interface Threshold {
    warning: number;
    critical: number;
    action: () => void;
}

export interface SystemState {
    bottleneck: string;
    optimal: number;
    affected: string;
    recommended: string;
    severity: 'low' | 'medium' | 'high';
    critical: boolean;
}

export interface RecoveryPlan {
    actions: {
        type: 'scale' | 'optimize';
        resource: string;
        target: number;
        component?: string;
        method?: string;
    }[];
    priority: 'low' | 'medium' | 'high';
    timeout: number;
}

export interface MetricReport {
    timestamp: number;
    metrics: {
        cpu: number;
        memory: number;
        disk: number;
        players: number;
    };
    analysis: {
        trend: boolean;
        anomaly: boolean;
        forecast: boolean;
    };
}

export interface MetricsCollector {
    initialize(): Promise<void>;
    collect(): Promise<MetricReport>;
}
