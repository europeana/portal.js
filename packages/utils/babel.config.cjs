// Babel config used by Jest, e.g. for unit tests
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: 'current' } }
    ]
  ]
};
