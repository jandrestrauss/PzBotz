class AdminDashboard {
    constructor() {
        this.ws = new WebSocket(`ws://${window.location.host}`);
        this.setupWebSocket();
        this.setupEventListeners();
        this.refreshData();
    }

    setupWebSocket() {
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'playerUpdate') {
                this.updatePlayerList(data.players);
            } else if (data.type === 'modUpdate') {
                this.updateModList(data.mods);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed. Reconnecting...');
            setTimeout(() => this.setupWebSocket(), 5000);
        };
    }

    setupEventListeners() {
        document.getElementById('startServer').onclick = () => this.serverAction('start');
        document.getElementById('stopServer').onclick = () => this.serverAction('stop');
        document.getElementById('restartServer').onclick = () => this.serverAction('restart');
        document.getElementById('backupServer').onclick = () => this.serverAction('backup');
        document.getElementById('checkModUpdates').onclick = () => this.checkModUpdates();
    }

    async serverAction(action) {
        try {
            const response = await fetch(`/api/server/${action}`, { method: 'POST' });
            const data = await response.json();
            this.showNotification(data.message);
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error performing server action', 'error');
        }
    }

    async checkModUpdates() {
        try {
            const response = await fetch('/api/mods/check');
            const data = await response.json();
            this.showNotification(data.message);
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error checking mod updates', 'error');
        }
    }

    updatePlayerList(players) {
        const container = document.getElementById('onlinePlayers');
        container.innerHTML = players.map(player => `
            <div class="player-card">
                <span>${player.name}</span>
                <div class="player-actions">
                    <button onclick="adminDashboard.playerAction('kick', '${player.id}')">Kick</button>
                    <button onclick="adminDashboard.playerAction('ban', '${player.id}')">Ban</button>
                </div>
            </div>
        `).join('');
    }

    updateModList(mods) {
        const container = document.getElementById('modList');
        container.innerHTML = mods.map(mod => `
            <div class="mod-item">
                <span>${mod.name}</span>
                <span>${mod.status}</span>
            </div>
        `).join('');
    }

    async playerAction(action, playerId) {
        try {
            const response = await fetch(`/api/players/${action}/${playerId}`, { method: 'POST' });
            const data = await response.json();
            this.showNotification(data.message);
        } catch (error) {
            console.error('Error:', error);
            this.showNotification(`Error performing player action: ${action}`, 'error');
        }
    }

    showNotification(message, type = 'success') {
        // Implement notification system
        console.log(`${type}: ${message}`);
    }

    refreshData() {
        fetch('/api/server/status')
            .then(response => response.json())
            .then(data => {
                this.updatePlayerList(data.players);
                this.updateModList(data.mods);
            })
            .catch(error => console.error('Error refreshing data:', error));
    }
}

const adminDashboard = new AdminDashboard();
