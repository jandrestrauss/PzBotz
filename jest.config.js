module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    "**/tests/**/*.test.js",
    "**/src/tests/**/*.test.js"
  ],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/tests/**"
  ],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 10000,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
