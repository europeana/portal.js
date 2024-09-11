import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import ItemMediaPresentation from '@/components/item/ItemMediaPresentation';
// import sinon from 'sinon';
import nock from 'nock';

const localVue = createLocalVue();

const factory = ({ propsData = {}, mocks = {} } = {}) => shallowMountNuxt(ItemMediaPresentation, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $apis: {
      record: {
        mediaProxyUrl: (url) => `mediaProxyUrl ${url}`
      }
    },
    $route: { query: {} },
    $t: (key) => key,
    ...mocks
  },
  stubs: ['MediaAudioVisualPlayer', 'MediaImageViewer', 'PaginationNavInput', 'b-button']
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
                      format: 'image/jpeg'
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

      it('fetches it and stores the parsed data to `manifest`', async() => {
        const wrapper = factory({ propsData });
        nock(origin).get(path).reply(200, responseData);

        await wrapper.vm.fetch();

        expect(nock.isDone()).toBe(true);
        expect(wrapper.vm.manifest).toEqual({
          id: 'https://iiif.europeana.eu/presentation/123/abc/manifest',
          service: [
            {
              context: 'http://iiif.io/api/search/1/context.json',
              id: 'https://iiif.europeana.eu/presentation/123/abc/search',
              profile: 'http://iiif.io/api/search/1/search'
            }
          ],
          canvases: [
            {
              id: 'https://iiif.europeana.eu/presentation/123/abc/canvas/1',
              content: [
                {
                  id: 'https://iiif.europeana.eu/presentation/123/abc/image1.jpg',
                  format: 'image/jpeg'
                }
              ]
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
          ebucoreWidth: 720,
          isPlayableMedia: true
        }
      ];
      const propsData = { itemId, webResources };

      it('converts and stores them to `manifest`', async() => {
        const wrapper = factory({ propsData });

        await wrapper.vm.fetch();

        expect(wrapper.vm.manifest).toEqual({
          canvases: [
            {
              content: [
                {
                  id: 'https://example.org/video.mp4',
                  url: 'mediaProxyUrl https://example.org/video.mp4',
                  format: 'video/mp4',
                  height: 576,
                  width: 720,
                  playable: true
                }
              ]
            }
          ]
        });
      });
    });
  });
});
