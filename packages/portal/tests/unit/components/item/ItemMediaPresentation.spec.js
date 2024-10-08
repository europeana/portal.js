import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import ItemMediaPresentation from '@/components/item/ItemMediaPresentation';
import nock from 'nock';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $apis = {
  record: {
    mediaProxyUrl: (url) => `mediaProxyUrl ${url}`
  },
  thumbnail: {
    media: (url) => `thumbnail api ${url}`
  }
};

const factory = ({ data = {}, propsData = {}, mocks = {} } = {}) => shallowMountNuxt(ItemMediaPresentation, {
  localVue,
  attachTo: document.body,
  directives: { 'b-tooltip': () => {} },
  propsData,
  data() {
    return { ...data };
  },
  mocks: {
    $apis,
    $fetchState: { pending: false },
    $nuxt: {
      context: {
        $apis
      }
    },
    $route: { query: {} },
    $t: (key) => key,
    ...mocks
  },
  stubs: ['MediaAudioVisualPlayer', 'MediaImageViewer', 'PaginationNavInput', 'ItemMediaThumbnails']
});

describe('components/item/ItemMediaPresentation', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('template', () => {
    it('renders a viewer wrapper', () => {
      const wrapper = factory();

      const viewerWrapper = wrapper.find('.iiif-viewer-wrapper');

      expect(viewerWrapper.isVisible()).toBe(true);
    });

    describe('sidebar toggle button', () => {
      describe('when there is a manifest uri', () => {
        it('is visible', () => {
          const wrapper = factory({ propsData: { uri: 'https://example.org/manifest' } });

          const sidebarToggle = wrapper.find('[data-qa="iiif viewer toolbar sidebar toggle"]');

          expect(sidebarToggle.isVisible()).toBe(true);
        });
      });

      describe('or when there are annotations', () => {
        it('is visible', () => {
          const wrapper = factory({ data: {
            presentation: {
              canvases: [
                { annotations: ['https://example.org/anno'] }
              ]
            }
          } });

          const sidebarToggle = wrapper.find('[data-qa="iiif viewer toolbar sidebar toggle"]');

          expect(sidebarToggle.isVisible()).toBe(true);
        });
      });

      describe('on click', () => {
        it('opens the sidebar', () => {
          const wrapper = factory({ propsData: { uri: 'https://example.org/manifest' } });

          wrapper.find('[data-qa="iiif viewer toolbar sidebar toggle"]').trigger('click');

          expect(wrapper.vm.showSidebar).toBe(true);
        });

        it('sets focus to the sidebar', async() => {
          const wrapper = factory({ propsData: { uri: 'https://example.org/manifest' } });
          wrapper.vm.$refs.sidebar.$el.focus = sinon.spy();

          wrapper.find('[data-qa="iiif viewer toolbar sidebar toggle"]').trigger('click');

          await wrapper.vm.$nextTick();

          expect(wrapper.vm.$refs.sidebar.$el.focus.called).toBe(true);
        });
      });
    });

    describe('pages toggle button', () => {
      const presentation = {
        canvases: [
          { resource: {} },
          { resource: {} }
        ]
      };

      describe('when there are two or more pages', () => {
        it('is visible', () => {
          const wrapper = factory({ data: { presentation } });

          const pagesToggle = wrapper.find('[data-qa="iiif viewer toolbar pages toggle"]');

          expect(pagesToggle.isVisible()).toBe(true);
        });
      });

      describe('on click', () => {
        it('closes and opens the item media thumbnails sidebar', () => {
          const wrapper = factory({ data: { presentation } });

          wrapper.find('[data-qa="iiif viewer toolbar pages toggle"]').trigger('click');
          expect(wrapper.vm.showPages).toBe(false);
          wrapper.find('[data-qa="iiif viewer toolbar pages toggle"]').trigger('click');
          expect(wrapper.vm.showPages).toBe(true);
        });

        it('sets focus to the item media thumbnails sidebar', async() => {
          const wrapper = factory({ data: { presentation } });

          wrapper.vm.$refs.itemPages.$el.focus = sinon.spy();
          wrapper.vm.showPages = false;

          wrapper.find('[data-qa="iiif viewer toolbar pages toggle"]').trigger('click');

          await wrapper.vm.$nextTick();

          expect(wrapper.vm.$refs.itemPages.$el.focus.called).toBe(true);
        });
      });
    });
  });

  describe('fetch', () => {
    describe('when supplied a manifest URI', () => {
      const origin = 'https://iiif.europeana.eu';
      const path = '/presentation/123/abc/manifest';
      const uri = `${origin}${path}`;
      const responseData = {
        '@context': ['http://www.w3.org/ns/anno.jsonld', 'http://iiif.io/api/presentation/3/context.json'],
        id: 'https://iiif.europeana.eu/presentation/123/abc/manifest',
        type: 'Manifest',
        service: [
          {
            '@context': 'http://iiif.io/api/search/1/context.json',
            id: 'https://iiif.europeana.eu/presentation/123/abc/search',
            profile: 'http://iiif.io/api/search/1/search'
          }
        ],
        items: [
          {
            type: 'Canvas',
            id: 'https://iiif.europeana.eu/presentation/123/abc/canvas/1',
            items: [
              {
                type: 'AnnotationPage',
                items: [
                  {
                    type: 'Annotation',
                    motivation: 'painting',
                    body: {
                      id: 'https://iiif.europeana.eu/presentation/123/abc/image1.jpg',
                      format: 'image/jpeg',
                      service: {
                        id: 'https://iiif.europeana.eu/image/123/abc/image1.jpg'
                      }
                    }
                  }
                ]
              }
            ]
          }
        ]
      };
      const propsData = {
        uri
      };

      it('fetches it and stores the parsed data to `presentation`', async() => {
        const wrapper = factory({ propsData });
        nock(origin).get(path).reply(200, responseData);

        await wrapper.vm.fetch();

        expect(nock.isDone()).toBe(true);
        expect(wrapper.vm.presentation).toEqual({
          id: 'https://iiif.europeana.eu/presentation/123/abc/manifest',
          search: [
            {
              context: 'http://iiif.io/api/search/1/context.json',
              id: 'https://iiif.europeana.eu/presentation/123/abc/search',
              profile: 'http://iiif.io/api/search/1/search'
            }
          ],
          canvases: [
            {
              id: 'https://iiif.europeana.eu/presentation/123/abc/canvas/1',
              resource: {
                about: 'https://iiif.europeana.eu/presentation/123/abc/image1.jpg',
                ebucoreHasMimeType: 'image/jpeg',
                svcsHasService: {
                  id: 'https://iiif.europeana.eu/image/123/abc/image1.jpg'
                }
              }
            }
          ]
        });
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

      it('stores them to `presentation`', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.vm.presentation).toEqual({
          canvases: [
            { resource: webResources[0] }
          ]
        });
      });
    });
  });
});
