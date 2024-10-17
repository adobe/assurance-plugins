module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.{js,ts,tsx}'],
  coverageReporters: ['cobertura', 'lcov', 'text'],
};