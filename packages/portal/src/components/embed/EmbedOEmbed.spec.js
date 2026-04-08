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
    // endpoint,
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

    describe('when endpoint is supplied', () => {
      it('makes an oEmbed request to the supplied endpoint', async() => {
        const wrapper = factory({ propsData: { url, endpoint } });
        nock(endpointOrigin)
          .get(endpointPath)
          .query(query => (query.url === url) && (query.format === 'json'))
          .reply(200, response);

        await wrapper.vm.fetch();

        expect(nock.isDone()).toBe(true);
      });
    });

    describe('when endpoint is not supplied', () => {
      describe('and url includes the oEmbed endpoint (service: true)', () => {
        const service = true;
        const serviceUrl = new URL(endpoint);
        serviceUrl.searchParams.set('url', url);

        it('makes an oEmbed request to that endpoint', async() => {
          const wrapper = factory({ propsData: { service, url: serviceUrl.toString() } });
          nock(endpointOrigin)
            .get(endpointPath)
            .query(query => (query.url === url) && (query.format === 'json'))
            .reply(200, response);

          await wrapper.vm.fetch();

          expect(nock.isDone()).toBe(true);
        });
      });

      describe('and url does not include the oEmbed endpoint (service: false)', () => {
        const service = false;

        describe('and url is for media from a known provider, e.g. Eureka3D', () => {
          const mediaUrl = new URL('https://eureka3d.vm.fedcloud.eu/3d/123');
          const endpointUrl = new URL('https://eureka3d.vm.fedcloud.eu/oembed');

          it('makes an oEmbed request to that endpoint', async() => {
            const wrapper = factory({ propsData: { service, url: mediaUrl.toString() } });
            nock(endpointUrl.origin)
              .get(endpointUrl.pathname)
              .query(query => (query.url === mediaUrl.toString()) && (query.format === 'json'))
              .reply(200, response);

            await wrapper.vm.fetch();

            expect(nock.isDone()).toBe(true);
          });
        });
      });
    });

    it('stores oEmbed data', async() => {
      const wrapper = factory({ propsData: { url, endpoint } });
      nock(endpointOrigin)
        .get(endpointPath)
        .query(query => (query.url === url) && (query.format === 'json'))
        .reply(200, response);

      await wrapper.vm.fetch();

      expect(wrapper.vm.html).toBe(response.html);
      expect(wrapper.vm.width).toBe(response.width);
      expect(wrapper.vm.height).toBe(response.height);
    });

    it('displays an error if response does not contain HTML', async() => {
      const response = {
        type: 'link'
      };
      const wrapper = factory({ propsData: { url, endpoint } });
      nock(endpointOrigin)
        .get(endpointPath)
        .query(query => (query.url === url) && (query.format === 'json'))
        .reply(200, response);

      await wrapper.vm.fetch();
      const alertMessage = wrapper.find('alertmessage-stub');

      expect(alertMessage.attributes('error')).toContain('messages.externalContentError');
    });

    describe('is re-triggerd by the mediaUrl watcher', () => {
      it('triggers a $fetch call', async() => {
        const wrapper = factory({ propsData: { url, endpoint } });

        sinon.spy(wrapper.vm, '$fetch');

        await wrapper.setProps({ url: 'https://example.org/media/456' });

        expect(wrapper.vm.$fetch.called).toBe(true);
      });
    });
  });
});
