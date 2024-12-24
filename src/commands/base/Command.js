class Command {
    constructor(name, description, options = {}) {
        this.name = name;
        this.description = description;
        this.cooldown = options.cooldown || 3; // seconds
        this.permissions = options.permissions || [];
        this.cooldowns = new Map();
    }

    checkPermissions(message) {
        return this.permissions.length === 0 || 
               this.permissions.some(perm => message.member.permissions.has(perm));
    }

    checkCooldown(userId) {
        if (this.cooldowns.has(userId)) {
            const timeLeft = this.cooldowns.get(userId) - Date.now();
            if (timeLeft > 0) {
                return Math.ceil(timeLeft / 1000);
            }
        }
        this.cooldowns.set(userId, Date.now() + (this.cooldown * 1000));
        return 0;
    }

    async execute(message, args) {
        throw new Error('Command execute method not implemented');
    }
}

module.exports = Command;
