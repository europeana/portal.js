export default {
  moduleFileExtensions: [
    'cjs',
    'js',
    'json',
    'mjs',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(js|mjs|cjs)$': ['babel-jest', { rootMode: 'upward' }]
  }
};
