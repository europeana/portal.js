import { createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import { shallowMountNuxt } from '../../utils';
import ItemMediaPresentation from '@/components/item/ItemMediaPresentation';
import * as itemMediaPresentation from '@/composables/itemMediaPresentation.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ data = {}, propsData = {}, mocks = {} } = {}) => shallowMountNuxt(ItemMediaPresentation, {
  localVue,
  propsData,
  data() {
    return { ...data };
  },
  mocks: {
    $fetchState: { pending: false },
    $route: { query: {} },
    ...mocks
  },
  stubs: ['ItemMediaSidebarWidget', 'ItemMediaPaginationWidget', 'MediaAudioVisualPlayer', 'MediaImageViewer', 'MediaImageViewerControls']
});

const fetchPresentationStub = sinon.stub();
const setPresentationFromWebResourcesStub = sinon.stub();
const setPageStub = sinon.stub();

const stubItemMediaPresentationComposable = (stubs = {}) => {
  sinon.stub(itemMediaPresentation, 'default').returns({
    annotations: ['https://example.org/anno'],
    fetchPresentation: fetchPresentationStub,
    presentation: {
      canvases: [
        { annotations: ['https://example.org/anno'], resource: {} },
        { resource: {} }
      ]
    },
    resourceCount: 2,
    setPage: setPageStub,
    setPresentationFromWebResources: setPresentationFromWebResourcesStub,
    ...stubs
  });
};

describe('components/item/ItemMediaPresentation', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('template', () => {
    it('renders a viewer wrapper', () => {
      stubItemMediaPresentationComposable();
      const wrapper = factory();

      const viewerWrapper = wrapper.find('.iiif-viewer-wrapper');

      expect(viewerWrapper.isVisible()).toBe(true);
    });

    describe('sidebar widget', () => {
      describe('when there is a manifest uri', () => {
        it('is visible', () => {
          stubItemMediaPresentationComposable();
          const wrapper = factory({ propsData: { uri: 'https://example.org/manifest' } });

          const sidebarWidget = wrapper.find('itemmediasidebarwidget-stub');

          expect(sidebarWidget.isVisible()).toBe(true);
        });
      });

      describe('or when there are annotations', () => {
        it('is visible', () => {
          stubItemMediaPresentationComposable({ hasAnnotations: true });
          const wrapper = factory();

          const sidebarWidget = wrapper.find('itemmediasidebarwidget-stub');

          expect(sidebarWidget.isVisible()).toBe(true);
        });
      });
    });

    describe('viewer zoom controls', () => {
      describe('when the current resource is of type image', () => {
        const itemId = '/123/abc';
        const webResources = [
          {
            about: 'https://example.org/image.jpg',
            ebucoreHasMimeType: 'image/jpeg',
            ebucoreHeight: 576,
            ebucoreWidth: 720
          }
        ];
        const propsData = { itemId, webResources };

        it('has viewer zoom controls', async() => {
          const wrapper = factory({ propsData });
          await wrapper.vm.fetch();

          const viewerControls = wrapper.find('mediaImageviewercontrols-stub');

          expect(viewerControls.isVisible()).toBe(true);
        });
      });
    });

    describe('pagination widget', () => {
      describe('when there are two or more pages', () => {
        it('is visible', () => {
          stubItemMediaPresentationComposable();
          const wrapper = factory();

          const pagesToggle = wrapper.find('itemmediapaginationwidget-stub');

          expect(pagesToggle.isVisible()).toBe(true);
        });
      });
    });
  });

  describe('fetch', () => {
    describe('when supplied a manifest URI', () => {
      const uri = 'https://iiif.europeana.eu/presentation/123/abc/manifest';

      it('fetches manifest via itemMediaPresentation composable', async() => {
        stubItemMediaPresentationComposable();
        const wrapper = factory({ propsData: { uri } });

        await wrapper.vm.fetch();

        expect(fetchPresentationStub.calledWith(uri)).toBe(true);
      });
    });

    describe('when supplied web resources', () => {
      const itemId = '/123/abc';
      const webResources = [
        {
          about: 'https://example.org/video.mp4',
          ebucoreHasMimeType: 'video/mp4',
          ebucoreHeight: 576,
          ebucoreWidth: 720
        }
      ];
      const propsData = { itemId, webResources };

      it('initialises presentation from them via itemMediaPresentation composable', async() => {
        stubItemMediaPresentationComposable();
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(setPresentationFromWebResourcesStub.calledWith(webResources)).toBe(true);
      });
    });
  });

  describe('methods', () => {
    describe('toggleFullscreen', () => {
      const data = {
        activeAnnotation: null,
        presentation: null,
        page: 1,
        showSidebar: null,
        showPages: true,
        fullscreen: false
      };

      describe('when in fullscreen mode already', () => {
        it('calls the document exitFullscreen method', () => {
          const wrapper = factory({ data });
          wrapper.setData({ fullscreen: true });
          document.exitFullscreen = sinon.spy();
          wrapper.vm.toggleFullscreen();

          expect(document.exitFullscreen.calledOnce).toBe(true);
          expect(wrapper.vm.fullscreen).toEqual(false);
        });
      });

      describe('when not in fullscreen mode', () => {
        it('makes the viewerWrapper fullscreen', () => {
          const wrapper = factory({ data });

          wrapper.vm.$refs.viewerWrapper.requestFullscreen = sinon.spy();
          wrapper.vm.toggleFullscreen();

          expect(wrapper.vm.$refs.viewerWrapper.requestFullscreen.calledOnce).toBe(true);
          expect(wrapper.vm.fullscreen).toEqual(true);
        });
      });
    });
  });
});
