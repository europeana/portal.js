export default {
  displayName: '@europeana/vue-service-manager',
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
  },
  transformIgnorePatterns: [
    '/node_modules/(?!uuid)'
  ]
};
