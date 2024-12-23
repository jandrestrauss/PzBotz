const config = {
  development: {
    dataPath: './dev-data/',
    debug: true
  },
  production: {
    dataPath: './data/',
    debug: false
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
