import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';
import EmbedOEmbed from '@/components/embed/EmbedOEmbed.vue';
import sinon from 'sinon';
import nock from 'nock';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const endpointOrigin = 'https://example.org';
const endpointPath = '/oembed';
const endpoint = `${endpointOrigin}${endpointPath}`;
const url = 'https://example.org/media/123';
const response = {
  type: 'rich',
  html: '<iframe src="https://example.org/embed/123"></iframe>',
  width: 640,
  height: 480,
  'provider_name': 'Example.org'
};

const factory = ({ propsData = {}, data = {} } = {}) => shallowMountNuxt(EmbedOEmbed, {
  propsData: {
    url,
    endpoint,
    ...propsData
  },
  data: () => ({
    html: response.html,
    ...data
  }),
  localVue,
  mocks: {
    $t: (key) => key
  },
  stubs: ['EmbedHTML', 'client-only', 'AlertMessage']
});

describe('components/embed/EmbedOEmbed', () => {
  describe('fetch', () => {
    beforeAll(() => {
      nock.disableNetConnect();
    });

    afterEach(nock.cleanAll);

    afterAll(() => {
      nock.enableNetConnect();
    });

    const nockRequest = () => nock(endpointOrigin)
      .get(endpointPath)
      .query(query => (query.url === url) && (query.format === 'json'));

    it('makes an oEmbed request to the provider', async() => {
      const wrapper = factory({ propsData: { url, endpoint } });
      nockRequest().reply(200, response);

      await wrapper.vm.fetch();

      expect(nock.isDone()).toBe(true);
    });

    it('stores oEmbed data', async() => {
      const wrapper = factory({ propsData: { url, endpoint } });
      nockRequest().reply(200, response);

      await wrapper.vm.fetch();

      expect(wrapper.vm.html).toBe(response.html);
      expect(wrapper.vm.width).toBe(response.width);
      expect(wrapper.vm.height).toBe(response.height);
      expect(wrapper.vm.providerName).toBe(response['provider_name']);
    });

    it('displays an error if response does not contain HTML', async() => {
      const response = {
        type: 'link'
      };
      const wrapper = factory({ propsData: { url, endpoint } });
      nockRequest().reply(200, response);

      await wrapper.vm.fetch();
      const alertMessage = wrapper.find('alertmessage-stub');

      expect(alertMessage.attributes('error')).toContain('messages.externalContentError');
    });
    describe('is re-triggerd by the url watcher', () => {
      it('triggers a $fetch call', async() => {
        const wrapper = factory({ propsData: { url, endpoint } });

        sinon.spy(wrapper.vm, '$fetch');

        await wrapper.vm.watch.url.call(wrapper.vm);
        expect(wrapper.vm.$fetch.called).toBe(true);
      });
    });
  });

  describe('computed', () => {
    describe('responsiveProvider', () => {
      it('is `true` for YouTube', () => {
        const wrapper = factory({ data: { 'providerName': 'YouTube' } });

        expect(wrapper.vm.responsiveProvider).toBe(true);
      });

      it('is `true` for Vimeo', () => {
        const wrapper = factory({ data: { 'providerName': 'Vimeo' } });

        expect(wrapper.vm.responsiveProvider).toBe(true);
      });

      it('is `true` for Sketchfab', () => {
        const wrapper = factory({ data: { 'providerName': 'Sketchfab' } });

        expect(wrapper.vm.responsiveProvider).toBe(true);
      });

      it('is `false` for SoundCloud', () => {
        const wrapper = factory({ data: { 'providerName': 'SoundCloud' } });

        expect(wrapper.vm.responsiveProvider).toBe(false);
      });
    });
  });
});
