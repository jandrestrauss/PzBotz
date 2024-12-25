class DashboardPanels {
    constructor() {
        this.activePanel = 'overview';
        this.charts = {};
        this.setupPanels();
    }

    setupPanels() {
        this.charts.players = this.createPlayerChart();
        this.charts.resources = this.createResourceChart();
        this.charts.backups = this.createBackupChart();
        
        document.querySelectorAll('.panel-switch').forEach(button => {
            button.addEventListener('click', () => this.switchPanel(button.dataset.panel));
        });
    }

    createPlayerChart() {
        return new Chart(document.getElementById('playerChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Online Players',
                    borderColor: '#4CAF50',
                    data: []
                }]
            },
            options: {
                animation: { duration: 0 }
            }
        });
    }

    updateCharts(data) {
        Object.keys(this.charts).forEach(chartName => {
            if (data[chartName]) {
                this.updateChartData(this.charts[chartName], data[chartName]);
            }
        });
    }

    switchPanel(panelId) {
        document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
        document.getElementById(panelId).style.display = 'block';
        this.activePanel = panelId;
    }
}
