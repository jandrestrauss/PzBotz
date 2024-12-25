class UserManagement {
    constructor() {
        this.users = new Map();
        this.setupEventListeners();
        this.loadUsers();
    }

    async loadUsers() {
        try {
            const response = await fetch('/api/admin/users');
            const users = await response.json();
            
            this.users.clear();
            users.forEach(user => this.users.set(user.id, user));
            this.renderUserList();
        } catch (error) {
            this.showError('Failed to load users');
        }
    }

    async updateUser(userId, data) {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Failed to update user');
            
            const updatedUser = await response.json();
            this.users.set(userId, updatedUser);
            this.renderUserList();
            this.showNotification('User updated successfully');
        } catch (error) {
            this.showError('Failed to update user');
        }
    }

    renderUserList() {
        const container = document.getElementById('user-list');
        container.innerHTML = Array.from(this.users.values())
            .map(user => this.createUserCard(user))
            .join('');
    }

    createUserCard(user) {
        return `
            <div class="user-card" data-id="${user.id}">
                <div class="user-info">
                    <h3>${user.username}</h3>
                    <span class="role ${user.role}">${user.role}</span>
                </div>
                <div class="user-stats">
                    <div>Points: ${user.points}</div>
                    <div>Last Seen: ${new Date(user.lastSeen).toLocaleString()}</div>
                </div>
                <div class="user-actions">
                    <button onclick="userManagement.editUser('${user.id}')">Edit</button>
                    <button onclick="userManagement.banUser('${user.id}')">Ban</button>
                </div>
            </div>
        `;
    }
}
