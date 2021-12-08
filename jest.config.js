module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  clearMocks: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|dist)[/\\\\]'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  silent: false,
  moduleNameMapper: {
    "^@n1ru4l/toposort$": "<rootDir>/node_modules/@n1ru4l/toposort/cjs/main.js"
  }
};
