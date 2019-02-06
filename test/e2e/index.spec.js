// test/index.test.js
import test from 'ava';
import createNuxt from '../helpers/createNuxt.js';

// We keep a reference to Nuxt so we can close
// the server at the end of the test
let nuxt = null;

// Init nuxt.js and create server listening on localhost:4000
test.before('Init Nuxt.js', async t => {
  nuxt = createNuxt();
  await nuxt.listen(4000, 'localhost');
});

// Example of testing only generated html
test('Route / exists and renders HTML', async t => {
  let context = {};
  console.log(context);
  const { html } = await nuxt.renderRoute('/', context);
  t.true(html.includes('Transforming the world with culture'));
});

// Example of testing only generated html
test('Route / with "what" param exists and renders HTML', async t => {
  let context = {};
  const { html } = await nuxt.renderRoute('/?what=hello%20world', context);
  t.true(html.includes('Transforming the world with hello world'));
});

// Close the Nuxt server
test.after('Closing server', t => {
  nuxt.close();
});