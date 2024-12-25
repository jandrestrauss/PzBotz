class AlertUI {
    constructor() {
        this.container = document.getElementById('alerts-container');
        this.alerts = new Map();
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.ws = new WebSocket(`ws://${window.location.host}/alerts`);
        this.ws.onmessage = (event) => {
            const alert = JSON.parse(event.data);
            this.showAlert(alert);
        };
    }

    showAlert(alert) {
        const alertElement = this.createAlertElement(alert);
        this.container.prepend(alertElement);
        
        if (alert.severity === 'critical') {
            alertElement.classList.add('alert-critical');
            this.playAlertSound();
        }

        setTimeout(() => alertElement.remove(), 10000);
    }

    createAlertElement(alert) {
        const element = document.createElement('div');
        element.className = `alert alert-${alert.severity}`;
        element.innerHTML = `
            <strong>${alert.severity.toUpperCase()}</strong>
            <span>${alert.message}</span>
            <div class="alert-meta">
                ${alert.metric}: ${alert.value}
                <time>${new Date(alert.timestamp).toLocaleTimeString()}</time>
            </div>
        `;
        return element;
    }

    playAlertSound() {
        const audio = new Audio('/sounds/alert.mp3');
        audio.play().catch(() => {});
    }
}
