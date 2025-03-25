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
    $apm: {
      captureError: sinon.spy()
    },
    $route: { query: {} },
    $t: (key) => key,
    ...mocks
  },
  provide: {
    itemIsDeleted: false
  },
  stubs: [
    'client-only',
    'EmbedGateway',
    'EmbedOEmbed',
    'IIIFErrorMessage',
    'ItemMediaPaginationToolbar',
    'ItemMediaSidebarToggle',
    'ItemMediaSidebar',
    'ItemMediaThumbnails',
    'MediaAudioVisualPlayer',
    'MediaImageViewer',
    'MediaImageViewerControls'
  ]
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
    resource: { edm: {}, id: 'https://iiif.example.org/image.jpeg' },
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

      const viewerWrapper = wrapper.find('.media-viewer-wrapper');

      expect(viewerWrapper.isVisible()).toBe(true);
    });

    describe('sidebar toggle', () => {
      describe('when there is a manifest uri', () => {
        it('is visible', () => {
          stubItemMediaPresentationComposable();
          const wrapper = factory({ propsData: { uri: 'https://example.org/manifest' } });

          const sidebarToggle = wrapper.find('itemmediasidebartoggle-stub');

          expect(sidebarToggle.isVisible()).toBe(true);
        });
      });

      describe('or when there are annotations', () => {
        it('is visible', () => {
          stubItemMediaPresentationComposable({ hasAnnotations: true });
          const wrapper = factory();

          const sidebarToggle = wrapper.find('itemmediasidebartoggle-stub');

          expect(sidebarToggle.isVisible()).toBe(true);
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
            ebucoreWidth: 720,
            imageSize: 'medium',
            isHTMLImage: true
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

    describe('thumbnail', () => {
      describe('when the resource is an oembed', () => {
        const webResources = [
          {
            about: 'https://example.org/embed',
            isOEmbed: true
          }
        ];
        const propsData = { webResources };

        it('is not displayed', async() => {
          const wrapper = factory({ propsData });
          await wrapper.vm.fetch();

          const thumbnail = wrapper.find('[data-qa="item media thumbnail"]');

          expect(thumbnail.exists()).toBe(false);
        });
      });

      describe('when the resource is playable A/V', () => {
        const webResources = [
          {
            about: 'https://example.org/video.mp4',
            isPlayableMedia: true
          }
        ];
        const propsData = { webResources };

        it('is not displayed', async() => {
          const wrapper = factory({ propsData });
          await wrapper.vm.fetch();

          const thumbnail = wrapper.find('[data-qa="item media thumbnail"]');

          expect(thumbnail.exists()).toBe(false);
        });
      });

      describe('when the resource is a PDF', () => {
        const webResources = [
          {
            about: 'https://example.org/media.pdf',
            isPDF: true
          }
        ];
        const propsData = { webResources };

        it('is displayed', async() => {
          const wrapper = factory({ propsData });
          await wrapper.vm.fetch();

          const thumbnail = wrapper.find('[data-qa="item media thumbnail"]');

          expect(thumbnail.isVisible()).toBe(true);
        });
      });

      describe('when the resource is an image', () => {
        describe('but is not extra large size', () => {
          const webResources = [
            {
              about: 'https://example.org/image.jpg',
              ebucoreHasMimeType: 'image/jpeg',
              ebucoreHeight: 1000,
              ebucoreWidth: 1000,
              imageSize: 'large',
              isHTMLImage: true
            }
          ];
          const propsData = { webResources };

          it('is not displayed', async() => {
            const wrapper = factory({ propsData });
            await wrapper.vm.fetch();

            const thumbnail = wrapper.find('[data-qa="item media thumbnail"]');

            expect(thumbnail.exists()).toBe(false);
          });
        });

        describe('and is extra large size', () => {
          const webResources = [
            {
              about: 'https://example.org/image.jpg',
              ebucoreHasMimeType: 'image/jpeg',
              ebucoreHeight: 2000,
              ebucoreWidth: 3000,
              imageSize: 'extra_large',
              isHTMLImage: true
            }
          ];
          const propsData = { webResources };

          it('is displayed', async() => {
            const wrapper = factory({ propsData });
            await wrapper.vm.fetch();

            const thumbnail = wrapper.find('[data-qa="item media thumbnail"]');

            expect(thumbnail.isVisible()).toBe(true);
          });

          it('also displays the load button', async() => {
            const wrapper = factory({ propsData });
            await wrapper.vm.fetch();

            const thumbnailNotification = wrapper.find('[data-qa="item media load button"]');

            expect(thumbnailNotification.isVisible()).toBe(true);
          });
        });
      });
    });

    describe('pagination toolbar', () => {
      describe('when there are two or more pages', () => {
        it('is visible', () => {
          stubItemMediaPresentationComposable();
          const wrapper = factory();

          const pagesToggle = wrapper.find('itemmediapaginationtoolbar-stub');

          expect(pagesToggle.isVisible()).toBe(true);
        });
      });
    });

    describe('error handling', () => {
      describe('when a fetch error occurs', () => {
        it('displays the error message component', async() => {
          stubItemMediaPresentationComposable({
            fetchPresentation: sinon.stub().rejects('Network error')
          });
          const uri = 'https://iiif.europeana.eu/presentation/123/abc/manifest';
          const wrapper = factory({ propsData: { uri } });

          await wrapper.vm.fetch();
          await wrapper.vm.$nextTick();

          const errorMessage = wrapper.find('iiiferrormessage-stub');

          expect(errorMessage.isVisible()).toBe(true);
        });
      });

      describe('when the image viewer component emits an error', () => {
        const itemId = '/123/abc';
        const webResources = [
          {
            about: 'https://example.org/image.jpg',
            ebucoreHasMimeType: 'image/jpeg',
            ebucoreHeight: 576,
            ebucoreWidth: 720,
            imageSize: 'medium',
            isHTMLImage: true
          }
        ];
        const propsData = { itemId, webResources };

        it('displays the error message component', async() => {
          const wrapper = factory({ propsData });
          await wrapper.vm.fetch();
          const imageViewer = wrapper.find('mediaimageviewer-stub');
          const imageError = new Error('Image failed to load');
          imageViewer.vm.$emit('error', imageError);
          await wrapper.vm.$nextTick();

          const errorMessage = wrapper.find('iiiferrormessage-stub');

          expect(errorMessage.isVisible()).toBe(true);
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

    describe('when there are annotations and on larger window', () => {
      it('shows the sidebar', async() => {
        stubItemMediaPresentationComposable({ hasAnnotations: true });
        const wrapper = factory({ propsData: { uri: 'https://example.org/manifest' } });
        window.innerWidth = 992;

        await wrapper.vm.fetch();

        expect(wrapper.vm.showSidebar).toBe(true);
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
        describe('and there is a fullscreen element', () => {
          it('calls the document exitFullscreen method', () => {
            const wrapper = factory({ data });

            wrapper.setData({ fullscreen: true });
            document.fullscreenElement = wrapper.vm.$refs.mediaViewerWrapper;
            document.exitFullscreen = sinon.spy();
            wrapper.vm.toggleFullscreen();

            expect(document.exitFullscreen.calledOnce).toBe(true);
            expect(wrapper.vm.fullscreen).toEqual(false);
          });
        });
        describe('and not using the fullscreen API', () => {
          it('resets the fullscreen styles', () => {
            const wrapper = factory({ data });

            wrapper.setData({ fullscreen: true, mockFullscreenClass: true });
            document.body.classList.remove = sinon.spy();
            wrapper.vm.toggleFullscreen();

            expect(document.body.classList.remove.calledWith('overflow-hidden')).toBe(true);
            expect(wrapper.vm.mockFullscreenClass).toEqual(false);
            expect(wrapper.vm.fullscreen).toEqual(false);
          });
        });
      });

      describe('when not in fullscreen mode', () => {
        describe('when browser fullscreen is supported and enabled', () => {
          it('makes the viewerWrapper fullscreen and starts listening for changes', () => {
            const wrapper = factory({ data });

            wrapper.vm.$refs.mediaViewerWrapper.requestFullscreen = true;
            document.fullscreenEnabled = true;
            document.addEventListener = sinon.spy();
            wrapper.vm.$refs.mediaViewerWrapper.requestFullscreen = sinon.spy();
            wrapper.vm.toggleFullscreen();

            expect(wrapper.vm.$refs.mediaViewerWrapper.requestFullscreen.calledOnce).toBe(true);
            expect(document.addEventListener.calledWith('fullscreenchange', wrapper.vm.handleFullscreenChange)).toBe(true);
            expect(wrapper.vm.fullscreen).toEqual(true);
          });
        });
        describe('when browser fullscreen is not supported or disabled', () => {
          it('adds styles to mock fullscreen', () => {
            const wrapper = factory({ data });

            document.body.classList.add = sinon.spy();
            wrapper.vm.toggleFullscreen();

            expect(document.body.classList.add.calledWith('overflow-hidden')).toBe(true);
            expect(wrapper.vm.mockFullscreenClass).toEqual(true);
            expect(wrapper.vm.fullscreen).toEqual(true);
          });
        });
      });
    });

    describe('handleFullscreenChange', () => {
      describe('when there is no fullscreen element on (after) change', () => {
        it('calls exitfullscreen and stops listening for changes', () => {
          const wrapper = factory({ fullscreen: true });

          document.fullscreenElement = null;
          wrapper.vm.exitFullscreen = sinon.spy();
          wrapper.vm.handleFullscreenChange();

          expect(wrapper.vm.exitFullscreen.calledOnce).toBe(true);
          expect(wrapper.vm.fullscreen).toEqual(false);
        });
      });
    });

    describe('toggleSidebar', () => {
      it('toggles the sidebar visibility and focus', async() => {
        const wrapper = factory({ propsData: { uri: 'https://example.org/manifest' } });
        wrapper.vm.$refs.sidebar.$el.focus = sinon.spy();

        expect(wrapper.vm.showSidebar).toBe(false);

        wrapper.vm.toggleSidebar();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.showSidebar).toBe(true);
        expect(wrapper.vm.$refs.sidebar.$el.focus.called).toBe(true);
      });
    });

    describe('togglePages', () => {
      it('toggles the item media thumbnails sidebar visibility and focus', async() => {
        stubItemMediaPresentationComposable();
        const wrapper = factory();
        wrapper.vm.$refs.itemPages.$el.focus = sinon.spy();

        expect(wrapper.vm.showPages).toBe(true);

        wrapper.vm.togglePages();

        expect(wrapper.vm.showPages).toBe(false);

        wrapper.vm.togglePages();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.showPages).toBe(true);
        expect(wrapper.vm.$refs.itemPages.$el.focus.called).toBe(true);
      });
    });
  });
});
