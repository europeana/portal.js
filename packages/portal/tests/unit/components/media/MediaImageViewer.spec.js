import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import MediaImageViewer from '@/components/media/MediaImageViewer';
import nock from 'nock';

const localVue = createLocalVue();

const factory = ({ propsData = {}, mocks = {} } = {}) => shallowMountNuxt(MediaImageViewer, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $fetchState: {},
    $t: (key) => key,
    ...mocks
  },
  stubs: []
});

describe('components/media/MediaImageViewer', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  const url = 'https://example.org/image.jpeg';

  describe('template', () => {
    it('renders a wrapper', () => {
      const wrapper = factory({ propsData: { url } });

      const viewerWrapper = wrapper.find('#media-image-viewer');

      expect(viewerWrapper.isVisible()).toBe(true);
    });
  });

  describe('fetch', () => {
    describe('without an image service', () => {
      it('renders a static image', async() => {
        const wrapper = factory({ propsData: { url } });

        await wrapper.vm.fetch();
        await new Promise(process.nextTick);

        // TODO: we should be testing the resultant html, but it's blank here
        expect(wrapper.vm.source).toBe('ImageStatic');
      });
    });

    describe('with an image service', () => {
      const origin = 'https://iiif.example.org';
      const path = '/image/image.jpeg';
      const id = `${origin}${path}`;
      const service = { id };

      beforeEach(() => {
        nock(origin).get(`${path}/info.json`).reply(200, { id });
      });

      it('fetches the service info', async() => {
        const wrapper = factory({ propsData: { url, service } });

        await wrapper.vm.fetch();
        await new Promise(process.nextTick);

        expect(nock.isDone()).toBe(true);
      });

      it('renders a IIIF image', async() => {
        const wrapper = factory({ propsData: { url, service } });

        await wrapper.vm.fetch();
        await new Promise(process.nextTick);

        // TODO: we should be testing the resultant html, but it's blank here
        expect(wrapper.vm.source).toBe('IIIF');
      });
    });
  });
});
