import { Nuxt, Builder } from 'nuxt';
import { resolve } from 'path';

let nuxt = null;

// export default function createNuxt () {
module.exports = function createNuxt () {
  const rootDir = resolve(__dirname, '../../');
  let config = require(resolve(rootDir, 'nuxt.config.js'));
  config.rootDir = rootDir; // project folder
  config.dev = false; // production build
  nuxt = new Nuxt(config);
  new Builder(nuxt).build();
  return nuxt;
};
