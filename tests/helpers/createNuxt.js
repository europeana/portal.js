// TODO: assess need for this once Vue CLI e2e plugin installed

import { Nuxt, Builder } from 'nuxt';
import { resolve } from 'path';

// export default function createNuxt () {
module.exports = async function createNuxt () {
  const rootDir = resolve(__dirname, '../../');
  let config = require(resolve(rootDir, 'nuxt.config.js'));
  config.rootDir = rootDir; // project folder
  config.dev = false; // production build
  config.buildDir = '.nuxt-test';
  let nuxt = new Nuxt(config);
  let builder = new Builder(nuxt);
  await builder.build();
  await nuxt.listen(4000, 'localhost');
  return nuxt;
};
