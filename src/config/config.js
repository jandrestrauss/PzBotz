const path = require('path');
const logger = require('../utils/logger');

const config = {
  development: {
    paths: {
      backups: process.env.BACKUP_PATH || path.join(__dirname, '../../backups'),
      logs: path.join(__dirname, '../../logs')
    }
  },
  production: {
    // Production config will inherit from development
  }
};

module.exports = config;
