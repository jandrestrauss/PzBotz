const { checkPermission, permissionMiddleware } = require('../../security/permissions');

describe('Permissions', () => {
    test('Should allow access for valid roles', () => {
        expect(checkPermission('admin', 'SERVER_CONTROL')).toBe(true);
        expect(checkPermission('moderator', 'MANAGE_USERS')).toBe(true);
        expect(checkPermission('user', 'VIEW_STATS')).toBe(true);
    });

    test('Should deny access for invalid roles', () => {
        expect(checkPermission('user', 'SERVER_CONTROL')).toBe(false);
        expect(checkPermission('moderator', 'MANAGE_BACKUPS')).toBe(false);
    });

    test('Middleware should allow access for valid roles', () => {
        const req = { user: { role: 'admin' } };
        const res = {};
        const next = jest.fn();

        permissionMiddleware('SERVER_CONTROL')(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test('Middleware should deny access for invalid roles', () => {
        const req = { user: { role: 'user' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        permissionMiddleware('SERVER_CONTROL')(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Permission denied'
        });
    });
});
