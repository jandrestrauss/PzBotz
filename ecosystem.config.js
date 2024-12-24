module.exports = {
    apps: [{
        name: 'PzBotz',
        script: './src/index.js',
        watch: false,
        env: {
            NODE_ENV: 'production'
        },
        error_file: './logs/pm2_error.log',
        out_file: './logs/pm2_out.log',
        time: true,
        instances: 1,
        autorestart: true,
        max_restarts: 5,
        restart_delay: 5000,
        max_memory_restart: '300M'
    }]
};
