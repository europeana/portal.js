export default {
  displayName: '@europeana/vue-contenful-graphql',
  moduleFileExtensions: [
    'js',
    'json',
    'mjs'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFiles: [
    '<rootDir>/jest.setup.js'
  ],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  transform: {
    '^.+\\.(js|mjs)$': 'babel-jest'
  }
};
