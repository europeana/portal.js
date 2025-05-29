import { createLocalVue, shallowMount } from '@vue/test-utils';
import nock from 'nock';
import sinon from 'sinon';

import gql from 'graphql-tag';

const query = `query Page($url: String!) {
  PageCollection(url: $url) {
    items {
      name
    }
  }
}`;
const ast = gql`${query}`;

import { useContentfulGraphql } from '@/composables/contentful/useContentfulGraphql.js';

const component = {
  template: '<span />',
  setup() {
    const { query } = useContentfulGraphql();
    return { query };
  }
};

const factory = ({ $apm, $config } = {}) => {
  const wrapper = shallowMount(component, {
    localVue: createLocalVue()
  });
  wrapper.vm.$root.$apm = $apm;
  wrapper.vm.$root.$config = $config;
  return wrapper;
};

const $config = {
  contentful: {
    accessToken: {
      delivery: 'access'
    },
    environmentId: 'test',
    graphQlOrigin: 'https://graphql.example.org',
    spaceId: 'space'
  }
};

describe('useContentfulGraphql', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(sinon.resetHistory);
  afterAll(() => {
    nock.enableNetConnect();
    sinon.restore();
  });

  describe('query', () => {
    it('queries the Contentful GraphQL endpoint with supplied query and variables', async() => {
      const variables = { url: '/' };

      nock($config.contentful.graphQlOrigin, {
        reqheaders: {
          authorization: `Bearer ${$config.contentful.accessToken.delivery}`
        }
      })
        .post(
          `/content/v1/spaces/${$config.contentful.spaceId}/environments/${$config.contentful.environmentId}`,
          {
            query,
            variables
          }
        )
        .query({ ...variables, _query: 'Page' })
        .reply(200, {});

      const wrapper = factory({ $config });

      await wrapper.vm.query(ast, variables);

      expect(nock.isDone()).toBe(true);
    });
  });
});
