const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { AppError } = require('../utils/errorHandler');

class AuthHandler {
    constructor() {
        this.secretKey = process.env.JWT_SECRET;
    }

    async generateToken(user) {
        return jwt.sign(
            { id: user.id, role: user.role },
            this.secretKey,
            { expiresIn: '24h' }
        );
    }

    async validateToken(token) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            throw new AppError('Invalid token', 401);
        }
    }

    authMiddleware = async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) throw new AppError('No token provided', 401);
            
            req.user = await this.validateToken(token);
            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthHandler();
