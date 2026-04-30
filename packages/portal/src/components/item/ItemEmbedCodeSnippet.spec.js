import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';

import ItemEmbedCodeSnippet from '@/components/item/ItemEmbedCodeSnippet.vue';
// import sinon from 'sinon';
import nock from 'nock';

const localVue = createLocalVue();

const factory = ({ propsData } = {})  => shallowMountNuxt(ItemEmbedCodeSnippet, {
  localVue,
  propsData,
  mocks: {
    // $config: {
    //   europeana: {

    //   }
    // }
    $fetchState: {},
    $t: (key) => key
  }
});

describe('ItemEmbedCodeSnippet', () => {
  const OEMBED_BASE_URL = 'https://oembed.europeana.eu';
  const identifier = '/123/abc';
  const html = '<iframe src=""></iframe>';

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    nock(OEMBED_BASE_URL)
      .get('/')
      .query(query => {
        return query.url === 'http://data.europeana.eu/item/123/abc' && query.format === 'json';
      })
      .reply(200, { html });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe('fetch', () => {
    it('sends an oEmbed request to the Europeana oEmbed provider', async() => {
      const wrapper = factory({ propsData: { identifier }  });

      await wrapper.vm.fetch();

      expect(nock.isDone()).toBe(true);
    });

    it('stores html from response body on component code property', async() => {
      const wrapper = factory({ propsData: { identifier } });

      await wrapper.vm.fetch();

      expect(wrapper.vm.code).toBe(html);
    });
  });
});
