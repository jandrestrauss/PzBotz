import errorConfig from '../../config/errorHandling';

export interface NotificationPayload {
    type: string;
    context?: string;
    severity?: 'low' | 'medium' | 'high';
    timestamp?: Date;
    [key: string]: any;
}

class NotificationService {
    private static instance: NotificationService;
    private throttleMap: Map<string, Date>;

    private constructor() {
        this.throttleMap = new Map();
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    async send(payload: NotificationPayload): Promise<void> {
        if (this.shouldThrottle(payload.type)) {
            return;
        }

        for (const channel of errorConfig.notification.channels) {
            await this.sendToChannel(channel, payload);
        }

        this.updateThrottleTime(payload.type);
    }

    private shouldThrottle(type: string): boolean {
        const lastSent = this.throttleMap.get(type);
        if (!lastSent) return false;
        
        const now = new Date();
        const throttleDuration = errorConfig.notification.throttleDuration;
        return now.getTime() - lastSent.getTime() < throttleDuration;
    }

    private updateThrottleTime(type: string): void {
        this.throttleMap.set(type, new Date());
    }

    private async sendToChannel(channel: string, payload: NotificationPayload) {
        // Implement the logic to send the alarm to the specified channel
    }
}

export default NotificationService;
