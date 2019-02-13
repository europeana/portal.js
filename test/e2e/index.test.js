import test from 'ava';
import nock from 'nock';
import createNuxt from '../helpers/createNuxt.js';
import fs from 'fs';
import path from 'path';

// We keep a reference to Nuxt so we can close
// the server at the end of the test
let nuxt;

// Init Nuxt.js and start listening on localhost:4000
test.before('Init Nuxt.js', async () => {
  nuxt = await createNuxt();

  const json = fs.readFileSync(path.resolve(__dirname, '../fixtures/contentful/homepage.json'), 'utf8');
  nock('https://cdn.contentful.com')
    .get(/^\/spaces\//)
    .query(query => {
      if (query['fields.identifier'] === '/') {
        return true;
      }
    })
    .reply(200, json);

  return nuxt;
});

// Test output of page-level headline and text fields
test('Route / exists and renders HTML', async t => {
  let context = {};
  const { html } = await nuxt.renderRoute('/', context);
  t.true(/<title[^>]*>Home<\/title>/.test(html));
  t.true(html.includes('<p>We transform the world with culture!</p>'));
});

// Close the Nuxt server
test.after('Closing server', () => {
  nuxt.close();
});
