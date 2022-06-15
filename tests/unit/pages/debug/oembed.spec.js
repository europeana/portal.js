import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';
import nock from 'nock';
import BootstrapVue from 'bootstrap-vue';

import DebugOEmbedPage from '@/pages/debug/oembed';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ data = {}, mocks = {} } = {}) => shallowMountNuxt(DebugOEmbedPage, {
  localVue,
  data() {
    return data;
  },
  mocks: {
    $pageHeadTitle: (text) => text,
    $route: {
      query: {}
    },
    $t: (key) => key,
    ...mocks
  }
});

describe('pages/debug/oembed', () => {
  const endpointOrigin = 'https://example.org';
  const endpointPath = '/oembed';
  const endpoint = `${endpointOrigin}${endpointPath}`;
  const url = 'https://example.org/media/123';
  const response = {
    type: 'rich',
    html: '<iframe src="https://example.org/embed/123"></iframe>'
  };

  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterEach(nock.cleanAll);

  afterAll(() => {
    nock.enableNetConnect();
  });

  const nockRequest = () => {
    return nock(endpointOrigin)
      .get(endpointPath)
      .query(query => (query.url === url) && (query.format === 'json'));
  };

  describe('methods', () => {
    describe('fetchOEmbedData', () => {
      const data = {
        endpoint,
        url
      };

      it('makes an oEmbed request for the endpoint and URL', async() => {
        const wrapper = factory();
        nockRequest().reply(200, response);
        await wrapper.setData(data);

        await wrapper.vm.fetchOEmbedData();

        expect(nock.isDone()).toBe(true);
      });

      it('stores the html from the oEmbed response', async() => {
        const wrapper = factory();
        nockRequest().reply(200, response);
        await wrapper.setData(data);

        await wrapper.vm.fetchOEmbedData();

        expect(wrapper.vm.oEmbedData).toEqual(response);
      });

      it('stores an error message if no html in oEmbed response', async() => {
        const wrapper = factory();
        nockRequest().reply(200, { type: 'unexpected' });
        await wrapper.setData(data);

        await wrapper.vm.fetchOEmbedData();

        expect(wrapper.vm.oEmbedData).toEqual({ error: 'messages.externalContentError' });
      });

      it('stores an error message if the oEmbed request failed', async() => {
        const wrapper = factory();
        nockRequest().replyWithError('Not Found');
        await wrapper.setData(data);

        await wrapper.vm.fetchOEmbedData();

        expect(wrapper.vm.oEmbedData).toEqual({ error: 'Not Found' });
      });
    });
  });

  describe('head', () => {
    it('sets title', () => {
      const wrapper = factory();

      const headTitle = wrapper.vm.head().title;

      expect(headTitle).toBe('oEmbed');
    });
  });
});
