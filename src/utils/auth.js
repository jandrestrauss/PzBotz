const jwt = require('jsonwebtoken');
const logger = require('./logger');

const authUtils = {
    authenticateSession(req, res, next) {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            logger.error('Authentication error:', error);
            res.status(401).json({ error: 'Invalid token' });
        }
    },

    generateToken(user) {
        return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
};

module.exports = authUtils;
