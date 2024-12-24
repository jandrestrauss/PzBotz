class SecurityService {
    constructor() {
        this.rateLimit = new RateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100
        });
        this.tokenValidator = new TokenValidator();
        this.permissionManager = new PermissionManager();
    }

    async validateRequest(req) {
        await this.rateLimit.check(req);
        await this.tokenValidator.validate(req.token);
        await this.permissionManager.checkPermissions(req.user, req.action);
    }

    async generateToken(user) {
        return this.tokenValidator.generate({
            userId: user.id,
            roles: user.roles,
            expiry: '24h'
        });
    }
}
