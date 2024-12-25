module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    setupFiles: ['<rootDir>/tests/setup.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/dashboard/**',
        '!src/workers/**'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70
        }
    }
};
