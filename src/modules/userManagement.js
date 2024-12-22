const bcrypt = require('bcrypt');
const { User } = require('../models');
const logger = require('../utils/logger');

class UserManagement {
    async createUser(username, password, role) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ username, password: hashedPassword, role });
            logger.info(`User created: ${username}`);
            return user;
        } catch (error) {
            logger.error('Error creating user:', error);
            throw error;
        }
    }

    async getUsers() {
        try {
            const users = await User.findAll();
            return users;
        } catch (error) {
            logger.error('Error fetching users:', error);
            throw error;
        }
    }

    async updateUser(id, updates) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            if (updates.password) {
                updates.password = await bcrypt.hash(updates.password, 10);
            }
            await user.update(updates);
            logger.info(`User updated: ${user.username}`);
            return user;
        } catch (error) {
            logger.error('Error updating user:', error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            await user.destroy();
            logger.info(`User deleted: ${user.username}`);
        } catch (error) {
            logger.error('Error deleting user:', error);
            throw error;
        }
    }

    async assignRole(userId, role) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            user.role = role;
            await user.save();
            logger.info(`Role ${role} assigned to user ${user.username}`);
            return user;
        } catch (error) {
            logger.error('Error assigning role:', error);
            throw error;
        }
    }

    async getUserPermissions(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Logic to get user permissions based on role
            const permissions = this.getPermissionsByRole(user.role);
            return permissions;
        } catch (error) {
            logger.error('Error fetching user permissions:', error);
            throw error;
        }
    }

    getPermissionsByRole(role) {
        const rolePermissions = {
            admin: ['create', 'read', 'update', 'delete'],
            user: ['read']
        };
        return rolePermissions[role] || [];
    }
}

module.exports = new UserManagement();
