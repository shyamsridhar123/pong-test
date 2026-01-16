module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'game.js',
    '!node_modules/**'
  ],
  testMatch: [
    '**/*.test.js'
  ]
};
