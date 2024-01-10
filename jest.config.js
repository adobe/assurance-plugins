module.exports = {
  // Run code coverage on all ts or tsx files inside the src directory
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}'
  ],
  "coveragePathIgnorePatterns": [
    'src/sample',
    'sample-ui-plugin',
    'testing-library'
  ],
  coverageReporters: ['cobertura', 'text', 'lcov'],

  transform: {
    '\\.tsx?$': ['babel-jest', { configFile: './babel-jest.config.js' }]
  },

  moduleNameMapper: {
    // mocking assests and styling
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/mocks/fileMock.ts',
    '^.+\\.(css|less|scss|sass)$': '<rootDir>/tests/mocks/styleMock.ts',
    /* mock models and services folder */
    '(assets|models|services)': '<rootDir>/tests/mocks/fileMock.ts'
  },

  moduleDirectories: ['node_modules', 'src', __dirname],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};
