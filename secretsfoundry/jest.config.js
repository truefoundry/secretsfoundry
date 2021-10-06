module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  clearMocks: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/src/'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|dist)[/\\\\]'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  silent: false,
};
