// Babel config used by Jest, e.g. for unit tests
module.exports = {
  // plugins: [
  //   '@babel/plugin-transform-logical-assignment-operators',
  //   '@babel/plugin-transform-nullish-coalescing-operator'
  // ],

  presets: [
    [
      '@babel/preset-env',
      { targets: { node: 'current' } }
    ]
  ]
};
