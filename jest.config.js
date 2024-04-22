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
    '<rootDir>/packages/portal',
    '<rootDir>/packages/v-visible-on-scroll',
    '<rootDir>/packages/vue-session'
  ]
};
