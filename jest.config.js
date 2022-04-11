export default {
  coveragePathIgnorePatterns: [
    '<rootDir>/src/plugins/i18n/locales.js',
    '<rootDir>/src/lang/',
    '<rootDir>/src/migrations/'
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{cjs,js,vue}'
  ],
  coverageReporters: [
    'html', 'lcov', 'text'
  ],
  moduleFileExtensions: [
    'cjs',
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.css$': '<rootDir>/tests/unit/styleMock.js'
  },
  setupFiles: [
    '<rootDir>/tests/unit/setup.js'
  ],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/.nuxt/',
    '<rootDir>/tmp/'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!decamelize)'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue2-jest'
  }
};
