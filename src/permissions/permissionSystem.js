const permissions = {
    admin: ['read', 'write', 'delete'],
    user: ['read', 'write'],
    guest: ['read']
};

function checkPermission(role, action) {
    return permissions[role] && permissions[role].includes(action);
}

module.exports = { checkPermission };
