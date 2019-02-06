const { Nuxt } = require('nuxt');
const { resolve } = require('path');

// export default function createNuxt () {
module.exports = function createNuxt () {
  const rootDir = resolve(__dirname, '../../');
  let config = require(resolve(rootDir, 'nuxt.config.js'));
  config.rootDir = rootDir; // project folder
  config.dev = false; // production build
  return new Nuxt(config);
};
