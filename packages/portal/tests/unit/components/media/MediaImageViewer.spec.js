import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import MediaImageViewer from '@/components/media/MediaImageViewer';
import useZoom from '@/composables/zoom.js';
import nock from 'nock';
import sinon from 'sinon';

const localVue = createLocalVue();

const factory = ({ propsData = {}, mocks = {} } = {}) => shallowMountNuxt(MediaImageViewer, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $apis: {
      record: {
        mediaProxyUrl: (url) => `mediaProxyUrl ${url}`
      }
    },
    $fetchState: {},
    $t: (key) => key,
    ...mocks
  }
});

describe('components/media/MediaImageViewer', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
    sinon.resetHistory();
  });
  afterAll(() => {
    nock.enableNetConnect();
    sinon.restore();
  });

  const url = 'https://example.org/image.jpeg';
  const width = 100;
  const height = 400;

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

  describe('methods', () => {
    describe('highlightAnnotation', () => {
      it('initialises a vector layer for annotations', async() => {
        const annotation = {
          target: {
            id: url
          }
        };
        const wrapper = factory({ propsData: { url, annotation, width, height } });

        await new Promise(process.nextTick);
        wrapper.vm.highlightAnnotation();

        expect(wrapper.vm.olMap.getLayers().getLength()).toBe(2);
      });

      describe('when annotation has no xywh co-ordinates', () => {
        const annotation = {
          target: {
            id: url
          }
        };

        it('adds a feature for the annotation at the full image size', async() => {
          const wrapper = factory({ propsData: { url, annotation, width, height } });

          await new Promise(process.nextTick);
          wrapper.vm.highlightAnnotation();
          const source = wrapper.vm.olMap.getLayers().item(1).getSource();

          expect(source.getFeatures()[0].getGeometry().flatCoordinates).toEqual([
            0, 400, 0, 0, 100, 0, 100, 400, 0, 400
          ]);
        });
      });

      describe('when annotation has xywh co-ordinates', () => {
        const annotation = {
          target: {
            id: `${url}#xywh=0,0,40,20`
          }
        };

        it('adds a feature for the annotation at its xywh co-ordinates', async() => {
          const wrapper = factory({ propsData: { url, annotation, width, height } });

          await new Promise(process.nextTick);
          wrapper.vm.highlightAnnotation();
          const source = wrapper.vm.olMap.getLayers().item(1).getSource();

          expect(source.getFeatures()[0].getGeometry().flatCoordinates).toEqual([
            0, 400, 0, 380, 40, 380, 40, 400, 0, 400
          ]);
        });
      });
    });

    describe('configureZoomLevels', () => {
      it('configures zoom levels via useZoom composable', async() => {
        const {
          default: defaultZoom,
          max: maxZoom,
          min: minZoom
        } = useZoom();
        const wrapper = factory({ propsData: { url, width, height } });

        await new Promise(process.nextTick);
        wrapper.vm.configureZoomLevels();

        expect(defaultZoom.value).toBe(0);
        expect(minZoom.value).toBe(0);
        expect(maxZoom.value).toBe(8);
      });
    });

    describe('setZoom', () => {
      it('sets the view to the data property currentZoom', async() => {
        const animateSpy = sinon.spy();
        const {
          setCurrent: setCurrentZoom
        } = useZoom();
        const wrapper = factory({ propsData: { url, width, height } });

        await new Promise(process.nextTick);
        wrapper.vm.olMap.getView = sinon.stub().returns({
          getZoom: () => 4,
          animate: animateSpy,
          getAnimating: () => true,
          cancelAnimations: () => true
        });

        // setZoom is called via watcher of currentZoom (via useZoom composable)
        setCurrentZoom(6);
        await new Promise(process.nextTick);

        expect(animateSpy.calledWith(sinon.match({ zoom: 6, duration: 250, easing: sinon.match.func }))).toBe(true);
      });
    });
  });
});
