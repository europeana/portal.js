import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import DebugOEmbedPage from '@/pages/debug/oembed';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = async({ data = {}, mocks = {} } = {}) => {
  const wrapper = shallowMountNuxt(DebugOEmbedPage, {
    localVue,
    data() {
      return data;
    },
    mocks: {
      $route: {
        query: {}
      },
      $router: { push: sinon.spy() },
      $t: (key) => key,
      ...mocks
    },
    stubs: ['EmbedOEmbed']
  });
  wrapper.vm.fetch();
  await wrapper.vm.$nextTick();
  return wrapper;
};

describe('pages/debug/oembed', () => {
  const endpoint = 'https://example.org/oembed';
  const url = 'https://example.org/media/123';

  describe('template', () => {
    describe('when query url and endpoint are not present', () => {
      const query = { url: null, endpoint: null };

      it('renders blank form to input url and endpoint', async() => {
        const wrapper = await factory({ mocks: { $route: { query } } });

        const urlInput = wrapper.find('[id="debug-oembed-url"]');
        expect(urlInput.exists()).toBe(true);
        expect(urlInput.attributes('value')).toBeUndefined();

        const endpointInput = wrapper.find('[id="debug-oembed-endpoint"]');
        expect(endpointInput.exists()).toBe(true);
        expect(endpointInput.attributes('value')).toBeUndefined();
      });

      it('does not render OEmbed component', async() => {
        const wrapper = await factory({ mocks: { $route: { query } } });

        const oEmbedComponent = wrapper.find('embedoembed-stub');
        expect(oEmbedComponent.exists()).toBe(false);
      });
    });

    describe('when query url and endpoint are present', () => {
      const query = { url, endpoint };

      it('renders pre-filled form to input url and endpoint', async() => {
        const wrapper = await factory({ mocks: { $route: { query } } });

        const urlInput = wrapper.find('[id="debug-oembed-url"]');
        expect(urlInput.exists()).toBe(true);
        expect(urlInput.attributes('value')).toBe(url);

        const endpointInput = wrapper.find('[id="debug-oembed-endpoint"]');
        expect(endpointInput.exists()).toBe(true);
        expect(endpointInput.attributes('value')).toBe(endpoint);
      });

      it('renders OEmbed component, client-side', async() => {
        const wrapper = await factory({ mocks: { $route: { query } } });

        const oEmbedComponent = wrapper.find('client-only-stub embedoembed-stub');
        expect(oEmbedComponent.exists()).toBe(true);
        expect(oEmbedComponent.vm.url).toBe(url);
        expect(oEmbedComponent.vm.endpoint).toBe(endpoint);
      });
    });
  });

  describe('fetch', () => {
    it('sets url and endpoint from route query', async() => {
      const query = { url, endpoint };
      const wrapper = await factory({ mocks: { $route: { query } } });

      expect(wrapper.vm.url).toBe(url);
      expect(wrapper.vm.formUrl).toBe(url);
      expect(wrapper.vm.endpoint).toBe(endpoint);
      expect(wrapper.vm.formEndpoint).toBe(endpoint);
    });
  });

  describe('methods', () => {
    describe('handleSubmitForm', () => {
      it('goes to route with url and endpoint from form', async() => {
        const wrapper = await factory();
        await wrapper.setData({
          formUrl: url,
          formEndpoint: endpoint
        });

        wrapper.vm.handleSubmitForm();

        expect(wrapper.vm.$router.push.calledWith({ query: { url, endpoint } })).toBe(true);
      });
    });
  });

  describe('head', () => {
    it('sets title', async() => {
      const wrapper = await factory();

      const headTitle = wrapper.vm.pageMeta.title;

      expect(headTitle).toBe('oEmbed');
    });
  });
});
