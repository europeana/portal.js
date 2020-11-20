// Fails with `TypeError: Expected parameter accessToken` from the contentful
// npm package.
// It seems process.env does not include the contents of the .env file, despite
// vue-test-utils using vue-cli-service and this: https://cli.vuejs.org/guide/mode-and-env.html
// TODO: figure out why, resolve, and complete unit tests

// import * as store from '../../../store/entity';
// import nock from 'nock';
// import sinon from 'sinon';
//
// const baseRequest = nock('https://cdn.contentful.com').get(`/spaces/${process.env.CTF_SPACE_ID}/environments/master/entries`);
//
// const contentfulResponse = {
//   items: [
//     { fields: { identifier: 'http://data.europeana.eu/concept/base/18', genre: 'newspaper' } },
//     { fields: { identifier: 'http://data.europeana.eu/concept/base/190', genre: 'art' } }
//   ]
// };
//
// describe('store/entity', () => {
//   describe('actions', () => {
//     describe('init', () => {
//       afterEach(() => {
//         nock.cleanAll();
//       });
//
//       it('queries Contentful for entity pages with collection set', async() => {
//         const commit = sinon.spy();
//
//         baseRequest
//           .query(query => {
//             return query.content_type === 'entityPage' &&
//               query['fields.genre[exists]'] === 'true' &&
//               query.include === '0';
//           })
//           .reply(200, contentfulResponse);
//
//         await store.actions.init({ commit });
//
//         nock.isDone().should.be.true;
//       });
//     });
//   });
// });
