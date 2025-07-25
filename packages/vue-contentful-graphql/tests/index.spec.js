import nock from 'nock';
import sinon from 'sinon';
import gql from 'graphql-tag';

import VueContentfulGraphql from '@/index.js';

const query = `query Page($url: String!) {
  PageCollection(url: $url) {
    items {
      name
    }
  }
}`;
const ast = gql`${query}`;

const config = {
  accessToken: {
    delivery: 'access'
  },
  environmentId: 'test',
  graphQlOrigin: 'https://graphql.example.org',
  spaceId: 'space'
};

describe('VueContentfulGraphql', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(sinon.resetHistory);
  afterAll(() => {
    nock.enableNetConnect();
    sinon.restore();
  });

  describe('install', () => {
    describe('when vue version is < 3', () => {
      const app = { prototype: {}, version: '2.7.16' };

      it('injects $contentful onto app prototype', () => {
        VueContentfulGraphql.install(app, config);

        expect(typeof app.prototype.$contentful.query).toBe('function');
      });
    });

    describe('when vue version is > 3', () => {
      const app = { config: { globalProperties: {} }, version: '3.0.0' };

      it('injects $contentful onto app config global properties', () => {
        VueContentfulGraphql.install(app, config);

        expect(typeof app.config.globalProperties.$contentful.query).toBe('function');
      });
    });
  });

  describe('query', () => {
    it('queries the Contentful GraphQL endpoint with supplied query and variables', async() => {
      const variables = { url: '/' };

      nock(config.graphQlOrigin, {
        reqheaders: {
          authorization: `Bearer ${config.accessToken.delivery}`,
          'content-type': 'application/json'
        }
      })
        .post(
          `/content/v1/spaces/${config.spaceId}/environments/${config.environmentId}`,
          {
            query,
            variables
          }
        )
        .query({ ...variables, _query: 'Page' })
        .reply(200, {});

      const app = { prototype: {} };

      VueContentfulGraphql.install(app, config);

      await app.prototype.$contentful.query(ast, variables);

      expect(nock.isDone()).toBe(true);
    });
  });
});
