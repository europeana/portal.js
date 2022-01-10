export default {
  collectCoverageFrom: [
    'src/**/*.{js,vue}'
  ],
  coverageReporters: [
    'html', 'lcov', 'text'
  ],
  moduleFileExtensions: [
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
    '^.+\\.js$': 'jest-esm-transformer',
    '^.+\\.vue$': '@vue/vue2-jest'
  }
};
