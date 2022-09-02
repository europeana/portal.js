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
    '^swiper$': '<rootDir>/tests/unit/swiperMock.js',
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
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.svg$': '<rootDir>/tests/unit/fileTransformer.cjs'
  }
};
