import baseConfig from './jest.config.base.js';

export default {
  ...baseConfig,
  projects: [ '<rootDir>/packages/*/jest.config.js'],
  coverageProvider: 'v8',
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: [
    '<rootDir>/packages/*/src/**/*.{cjs,js,mjs,vue}'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/packages/portal/src/plugins/i18n/locales.js',
    '<rootDir>/packages/portal/src/lang/'
  ],
  coverageReporters: [
    'html',
    'lcov',
    'text'
  ]
};
