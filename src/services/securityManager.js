class SecurityManager {
    constructor() {
        this.rateLimiter = new RateLimiter();
        this.tokenValidator = new TokenValidator();
        this.permissionManager = new PermissionManager();
    }

    async validateRequest(request) {
        await this.rateLimiter.check(request);
        await this.tokenValidator.validate(request.token);
        return this.permissionManager.checkPermissions(request.user, request.action);
    }
}

module.exports = new SecurityManager();
