process.env.TZ = 'UTC'
process.env.NODE_ICU_DATA = 'node_modules/full-icu'

module.exports = {
  cacheDirectory: './.jest-cache',
  coverageReporters: ['html', 'json', 'lcov', 'text'],
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/*{!(test),}.js',
    'src/*{!(test),}.jsx',
    'src/**/*{!(test),}.js',
    'src/**/*{!(test),}.jsx',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/tools/',
  ],
  moduleNameMapper: {
    'pixel-hero': '<rootDir>/src',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tools/__mocks__/mock.js',
  },
  setupFilesAfterEnv: [
    '@babel/polyfill',
    'full-icu',
    '@testing-library/jest-dom/extend-expect',
    'window-crypto',
    '<rootDir>/tools/helpers/jest.setup.afterEnv.js',
  ],
  testMatch: [
    '<rootDir>/src/*.test.js',
    '<rootDir>/src/*.test.jsx',
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.test.jsx',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/tools/',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testURL: 'http://localhost/',
  verbose: true,
}
