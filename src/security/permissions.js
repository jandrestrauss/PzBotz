const roles = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user'
};

const permissions = {
    SERVER_CONTROL: ['admin'],
    MANAGE_USERS: ['admin', 'moderator'],
    VIEW_STATS: ['admin', 'moderator', 'user'],
    MANAGE_BACKUPS: ['admin']
};

const checkPermission = (userRole, action) => {
    if (!permissions[action]) {
        return false;
    }
    return permissions[action].includes(userRole);
};

const checkPermissions = (user, action) => {
    // Logic to check user permissions
    // Example:
    const userPermissions = getUserPermissions(user);
    return userPermissions.includes(action);
};

const permissionMiddleware = (action) => (req, res, next) => {
    if (!req.user || !checkPermission(req.user.role, action)) {
        return res.status(403).json({
            status: 'error',
            message: 'Permission denied'
        });
    }
    next();
};

module.exports = { roles, permissions, checkPermission, checkPermissions, permissionMiddleware };
