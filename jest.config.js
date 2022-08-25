export default {
  coveragePathIgnorePatterns: [
    '<rootDir>/packages/portal/src/plugins/i18n/locales.js',
    '<rootDir>/packages/portal/src/lang/',
    '<rootDir>/packages/portal/src/migrations/'
  ],
  collectCoverageFrom: [
    '<rootDir>/packages/portal/src/**/*.{cjs,js,vue}'
  ],
  coverageReporters: [
    'html',
    'lcov',
    'text'
  ],
  moduleFileExtensions: [
    'cjs',
    'js',
    'json',
    'mjs',
    'vue'
  ],
  moduleNameMapper: {
    '^swiper$': '<rootDir>/tests/unit/swiperMock.js',
    '^@/(.*)$': '<rootDir>/packages/portal/src/$1',
    '\\.css$': '<rootDir>/tests/unit/styleMock.js'
  },
  setupFiles: [
    '<rootDir>/tests/unit/setup.js'
  ],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/packages/portal/.nuxt/',
    '<rootDir>/packages/portal/tmp/'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!decamelize)'
  ],
  transform: {
    '^.+\\.(js|mjs)$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue2-jest',
    '\\.(svg)$': '<rootDir>/tests/unit/fileTransformer.cjs'
  }
};
