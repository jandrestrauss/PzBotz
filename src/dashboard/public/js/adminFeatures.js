class AdminFeatures {
    constructor() {
        this.setupEventListeners();
        this.loadScheduledTasks();
    }

    setupEventListeners() {
        document.getElementById('batch-commands').addEventListener('submit', e => {
            e.preventDefault();
            this.executeBatchCommands(e.target.commands.value);
        });

        document.getElementById('schedule-task').addEventListener('submit', e => {
            e.preventDefault();
            this.scheduleTask({
                command: e.target.command.value,
                schedule: e.target.schedule.value,
                repeat: e.target.repeat.checked
            });
        });
    }

    async executeBatchCommands(commands) {
        const commandList = commands.split('\n').filter(cmd => cmd.trim());
        const results = [];

        for (const cmd of commandList) {
            try {
                const result = await this.executeCommand(cmd);
                results.push({ command: cmd, success: true, result });
            } catch (error) {
                results.push({ command: cmd, success: false, error: error.message });
            }
        }

        this.displayResults(results);
    }

    async scheduleTask(task) {
        try {
            const response = await fetch('/api/admin/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });

            if (!response.ok) throw new Error('Failed to schedule task');
            this.showNotification('Task scheduled successfully');
            await this.loadScheduledTasks();
        } catch (error) {
            this.showError('Failed to schedule task');
        }
    }

    displayResults(results) {
        const container = document.getElementById('command-results');
        container.innerHTML = results.map(result => `
            <div class="result ${result.success ? 'success' : 'error'}">
                <code>${result.command}</code>
                <span>${result.success ? result.result : result.error}</span>
            </div>
        `).join('');
    }
}
