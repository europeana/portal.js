export default {
  coveragePathIgnorePatterns: [
    '<rootDir>/src/i18n/locales.js',
    '<rootDir>/src/i18n/lang/'
  ],
  displayName: 'portal',
  moduleFileExtensions: [
    'js',
    'json',
    'mjs',
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
    '^.+\\.(js|mjs)$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.(ico|svg)$': '<rootDir>/tests/unit/fileTransformer.cjs'
  }
};
