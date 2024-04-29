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
    '<rootDir>/packages/oembed',
    '<rootDir>/packages/portal',
    '<rootDir>/packages/vue-router-query',
    '<rootDir>/packages/vue-session'
  ]
};
