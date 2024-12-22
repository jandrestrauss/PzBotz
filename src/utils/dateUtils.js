const logger = require('../utils/logger');

function formatDate(date) {
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
        logger.error('Error formatting date:', error);
        return null;
    }
}

module.exports = { formatDate };
