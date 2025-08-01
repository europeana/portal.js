export default {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{cjs,js,vue}'
  ],
  coverageProvider: 'v8',
  coverageReporters: [
    'html',
    'lcov',
    'text'
  ],
  projects: [
    '<rootDir>/packages/i18n',
    '<rootDir>/packages/portal',
    '<rootDir>/packages/vue-contentful-graphql',
    '<rootDir>/packages/vue-router-query',
    '<rootDir>/packages/vue-session',
    '<rootDir>/packages/vue-visible-on-scroll'
  ]
};
