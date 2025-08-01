import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import MediaImageViewer from '@/components/media/MediaImageViewer';
import * as itemMediaPresentation from '@/composables/itemMediaPresentation.js';
import useZoom from '@/composables/zoom.js';
import sinon from 'sinon';

const localVue = createLocalVue();

const fetchCanvasAnnotationsSpy = sinon.spy();
const setActiveAnnotationSpy = sinon.spy();
const routerReplaceSpy = sinon.spy();

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
    $t: (key) => key,
    $router: {
      replace: routerReplaceSpy
    },
    ...mocks
  }
});

const stubItemMediaPresentationComposable = (stubs = {}) => {
  sinon.stub(itemMediaPresentation, 'default').returns({
    annotationAtCoordinate: undefined,
    activeAnnotation: undefined,
    fetchCanvasAnnotations: fetchCanvasAnnotationsSpy,
    pageForAnnotationTarget: () => 1,
    setActiveAnnotation: setActiveAnnotationSpy,
    ...stubs
  });
};

describe('components/media/MediaImageViewer', () => {
  afterEach(() => {
    sinon.resetHistory();
    sinon.restore();
  });
  afterAll(() => {
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
      it('renders the static image', async() => {
        const wrapper = factory({ propsData: { url, width, height } });
        sinon.spy(wrapper.vm, 'initOlImageLayerStatic');

        process.client = true;
        await wrapper.vm.fetch();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.initOlImageLayerStatic.calledWith(`mediaProxyUrl ${url}`, width, height)).toBe(true);
      });
    });

    describe('with an image service', () => {
      const origin = 'https://iiif.example.org';
      const path = '/image/image.jpeg';
      const id = `${origin}${path}`;
      const imageInfoData = {
        '@context': 'http://iiif.io/api/image/2/context.json',
        '@id': id,
        height: 500,
        protocol: 'http://iiif.io/api/image',
        sizes: [
          { height: 500, width: 1000 }
        ],
        width: 1000
      };
      const fetchInfoStub = sinon.stub().resolves({ data: imageInfoData });
      const service = { id, fetchInfo: fetchInfoStub };

      it('fetches the service info', async() => {
        const wrapper = factory({ propsData: { url, service } });

        await wrapper.vm.fetch();
        await new Promise(process.nextTick);

        expect(fetchInfoStub.called).toBe(true);
      });

      it('renders a IIIF image', async() => {
        const wrapper = factory({ propsData: { url, service } });
        sinon.spy(wrapper.vm, 'initOlImageLayerIIIF');

        process.client = true;
        await wrapper.vm.fetch();
        await wrapper.vm.$nextTick();

        // TODO: we should be testing the resultant html, but it's blank here
        expect(wrapper.vm.source).toBe('IIIF');
        expect(wrapper.vm.initOlImageLayerIIIF.called).toBe(true);
      });

      describe('when request errors', () => {
        const error = new Error('fail');
        const fetchInfoStub = sinon.stub().rejects(error);
        const service = { id, fetchInfo: fetchInfoStub };

        it('emits the error', async() => {
          const wrapper = factory({ propsData: { url, service } });

          await wrapper.vm.fetch();
          await new Promise(process.nextTick);

          expect(wrapper.emitted('error')[0][0]).toEqual(error);
        });
      });
    });
  });

  describe('methods', () => {
    describe('highlightAnnotations', () => {
      it('initialises multiple vector layers for annotations', async() => {
        const annotation = {
          target: {
            id: url
          }
        };
        stubItemMediaPresentationComposable({ activeAnnotation: annotation, hasAnnotations: true });
        const wrapper = factory({ propsData: { url, width, height } });
        await wrapper.vm.fetch();

        await new Promise(process.nextTick);
        wrapper.vm.highlightAnnotations();

        expect(wrapper.vm.olMap.getLayers().getLength()).toBe(4);
        expect(wrapper.vm.olMap.getLayers().item(1).get('id')).toBe('search');
        expect(wrapper.vm.olMap.getLayers().item(2).get('id')).toBe('hover');
        expect(wrapper.vm.olMap.getLayers().item(3).get('id')).toBe('active');
      });

      describe('when annotation has no xywh co-ordinates', () => {
        const annotation = {
          target: {
            id: url
          }
        };

        it('adds a feature for the annotation at the full image size', async() => {
          stubItemMediaPresentationComposable({ activeAnnotation: annotation, hasAnnotations: true });
          const wrapper = factory({ propsData: { url, width, height } });
          await wrapper.vm.fetch();

          await new Promise(process.nextTick);
          wrapper.vm.highlightAnnotations();
          const source = wrapper.vm.olMap.getLayers().pop().getSource();

          expect(source.getFeatures()[0].getGeometry().flatCoordinates).toEqual([
            0, 400, 0, 0, 100, 0, 100, 400, 0, 400
          ]);
        });
      });

      describe('when annotation has xywh co-ordinates/extent', () => {
        const annotation = {
          target: {
            id: `${url}#xywh=0,0,40,20`
          },
          extent: [0, 0, 40, 20]
        };

        it('adds a feature for the annotation at its xywh co-ordinates', async() => {
          stubItemMediaPresentationComposable({ activeAnnotation: annotation, hasAnnotations: true });
          const wrapper = factory({ propsData: { url, width, height } });
          await wrapper.vm.fetch();

          await new Promise(process.nextTick);
          wrapper.vm.highlightAnnotations();
          const source = wrapper.vm.olMap.getLayers().pop().getSource();

          expect(source.getFeatures()[0].getGeometry().flatCoordinates).toEqual([
            0, 400, 0, 380, 40, 380, 40, 400, 0, 400
          ]);
        });
      });
    });

    describe('handleMapClick',  () => {
      describe('when a location with an annotation is clicked', () => {
        it('updates the "anno" param in the url via route push', async() => {
          const annotation = {
            id: url,
            target: {
              id: `${url}#xywh=0,0,40,20`
            },
            extent: [0, 0, 40, 20]
          };
          stubItemMediaPresentationComposable({ activeAnnotation: null, annotationAtCoordinate: () => annotation });
          const expectedRouteArgs = {
            query: {
              anno: annotation.id,
              page: 1
            },
            hash: '#annotations'
          };
          const wrapper = factory({ propsData: { url, width, height }, mocks: { $route: { query: {}, hash: undefined } } });
          await new Promise(process.nextTick);
          wrapper.vm.handleMapClick([10, 10]);
          expect(routerReplaceSpy.calledWith(sinon.match(expectedRouteArgs))).toBe(true);
        });
      });

      describe('when a location without annotation is clicked', () => {
        it('removes the "anno" param in the url via route push', async() => {
          const annotation = {
            id: url,
            target: {
              id: `${url}#xywh=0,0,40,20`
            },
            extent: [0, 0, 40, 20]
          };
          stubItemMediaPresentationComposable({ activeAnnotation: annotation, annotationAtCoordinate: () => undefined });
          const expectedRouteArgs = {
            query: {
              anno: undefined,
              page: 1
            },
            hash: '#annotations'
          };
          const wrapper = factory({ propsData: { url, width, height }, mocks: { $route: { query: {}, hash: '#search' } } });
          await wrapper.vm.fetch();

          await new Promise(process.nextTick);
          wrapper.vm.handleMapClick([200, 600]);

          expect(routerReplaceSpy.calledWith(sinon.match(expectedRouteArgs))).toBe(true);
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
        await wrapper.vm.fetch();

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
        await wrapper.vm.fetch();

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
