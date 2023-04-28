import baseConfig from '../../jest.config.base.js';

export default {
  ...baseConfig,
  coveragePathIgnorePatterns: [
    '<rootDir>/src/plugins/i18n/locales.js',
    '<rootDir>/src/lang/'
  ],
  moduleNameMapper: {
    ...(baseConfig.moduleNameMapper || {}),
    '^swiper$': '<rootDir>/tests/unit/swiperMock.js',
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
    ...(baseConfig.transform || {}),
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.svg$': '<rootDir>/tests/unit/fileTransformer.cjs'
  }
};
