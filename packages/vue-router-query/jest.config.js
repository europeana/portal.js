export default {
  displayName: '@europeana/vue-router-query',
  moduleFileExtensions: [
    'js',
    'json',
    'mjs'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  transform: {
    '^.+\\.(js|mjs)$': 'babel-jest'
  }
};
