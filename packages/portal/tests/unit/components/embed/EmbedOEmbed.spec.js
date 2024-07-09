import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import EmbedOEmbed from '@/components/embed/EmbedOEmbed.vue';
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
    $fetchState: {},
    $t: (key) => key
  },
  stubs: ['EmbedHTML', 'client-only']
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

    it('throws an error if response does not contain HTML', async() => {
      const response = {
        type: 'link'
      };
      const wrapper = factory({ propsData: { url, endpoint } });
      nockRequest().reply(200, response);

      let error;
      try {
        await wrapper.vm.fetch();
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('messages.externalContentError');
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
