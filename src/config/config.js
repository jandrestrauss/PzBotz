// ...existing code...

const config = {
  PORT: process.env.PORT || 3000,
  DB_CONNECTION: process.env.DB_CONNECTION || 'mongodb://localhost:27017/pzbotz',
  MAX_REQUESTS_PER_MINUTE: process.env.MAX_REQUESTS_PER_MINUTE || 60,
  // ...other configuration options...
};

module.exports = config;
