export default {
  collectCoverageFrom: [
    'src/**/*.{js,vue}'
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
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue2-jest'
  }
};
