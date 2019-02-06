import { Nuxt, Builder } from 'nuxt';
import { resolve } from 'path';

let nuxt = null;

// export default function createNuxt () {
module.exports = function createNuxt () {
  const rootDir = resolve(__dirname, '../../');
  let config = {};
  try {
    config = require(resolve(rootDir, 'nuxt.config.js'));
  } catch (e) {}
  config.rootDir = rootDir; // project folder
  config.dev = false; // production build
  config.mode = 'universal'; // Isomorphic application
  nuxt = new Nuxt(config);
  new Builder(nuxt).build();
  return nuxt;
};
