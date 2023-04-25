import { shallowMountNuxt } from '../../utils';
import axios from 'axios';
import nock from 'nock';
import sinon from 'sinon';

import page from '@/pages/iiif/index';

const factory = ({ data = {} } = {}) => shallowMountNuxt(page, {
  data() {
    return {
      uri: 'http://example.org/iiif/manifest.json',
      ...data
    };
  },
  mocks: {
    $axios: axios
  }
});

describe('pages/iiif/index.vue', () => {
  beforeEach(() => {
    window.Mirador = {
      viewer: sinon.stub().returns({
        store: {
          subscribe: sinon.stub()
        }
      })
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('computed', () => {
    describe('iiifPresentationApiVersion', () => {
      it('is 2 for IIIF Presentation API v2 manifests', () => {
        const manifest = {
          '@context': 'http://iiif.io/api/presentation/2/context.json'
        };

        const wrapper = factory({ data: { manifest } });

        expect(wrapper.vm.iiifPresentationApiVersion).toBe(2);
      });

      it('is 3 for IIIF Presentation API v2 manifests', () => {
        const manifest = {
          '@context': 'http://iiif.io/api/presentation/3/context.json'
        };

        const wrapper = factory({ data: { manifest } });

        expect(wrapper.vm.iiifPresentationApiVersion).toBe(3);
      });

      it('is undefined otherwise', () => {
        const manifest = {
          '@context': 'http://iiif.io/api/presentation/4/context.json'
        };

        const wrapper = factory({ data: { manifest } });

        expect(wrapper.vm.iiifPresentationApiVersion).toBe(undefined);
      });
    });
  });

  describe('methods', () => {
    describe('watchMiradorSetCanvas', () => {
      it('calls memoiseImageToCanvasMap', () => {
        const manifest = {
          '@context': 'http://iiif.io/api/presentation/3/context.json'
        };
        const wrapper = factory({ data: { manifest } });
        sinon.spy(wrapper.vm, 'memoiseImageToCanvasMap');

        wrapper.vm.watchMiradorSetCanvas({ canvasId: 'https://example.org/canvas' }).next();

        expect(wrapper.vm.memoiseImageToCanvasMap.called).toBe(true);
      });

      it('calls postUpdatedDownloadLinkMessage with canvasId', () => {
        const manifest = {
          '@context': 'http://iiif.io/api/presentation/3/context.json'
        };
        const wrapper = factory({ data: { manifest } });
        sinon.spy(wrapper.vm, 'postUpdatedDownloadLinkMessage');

        wrapper.vm.watchMiradorSetCanvas({ canvasId: 'https://example.org/canvas' }).next();

        expect(wrapper.vm.postUpdatedDownloadLinkMessage.calledWith('https://example.org/canvas')).toBe(true);
      });
    });

    describe('addAcceptHeaderToPresentationRequests', () => {
      describe('when url is for Europeana IIIF Presentation API', () => {
        const url = 'https://iiif.europeana.eu/presentation/123/abc/manifest';
        it('adds Accept header for v3', () => {
          const wrapper = factory();
          const options = {};

          wrapper.vm.addAcceptHeaderToPresentationRequests(url, options);

          expect(options.headers.Accept).toBe('application/ld+json;profile="http://iiif.io/api/presentation/3/context.json"');
        });
      });

      describe('when url is not for Europeana IIIF Presentation API', () => {
        const url = 'https://iiif.example.org/presentation/123/abc/manifest';
        it('does not add Accept header for v3', () => {
          const wrapper = factory();
          const options = {};

          wrapper.vm.addAcceptHeaderToPresentationRequests(url, options);

          expect(options.headers).toBeUndefined();
        });
      });
    });

    describe('coerceItemTargetImagesToCanvases', () => {
      it('coerces item\'s `target` attribute to canvas ID', async() => {
        const wrapper = factory();
        await wrapper.setData({
          imageToCanvasMap: {
            'https://example.org/image/123.jpg': 'http://example.org/presentation/123/canvas/p1'
          }
        });
        const resource = {
          target: ['https://example.org/image/123.jpg#xywh=1,0,90,100']
        };

        wrapper.vm.coerceItemTargetImagesToCanvases(resource);

        expect(resource).toEqual({
          target: ['http://example.org/presentation/123/canvas/p1#xywh=1,0,90,100']
        });
      });
    });

    describe('coerceSearchHitsToBeforeMatchAfter', () => {
      it('coerces search hits from selectors to before/match/after', () => {
        const wrapper = factory();
        const searchJson = {
          hits: [
            {
              '@type': 'search:Hit',
              annotations: [],
              selectors: [
                {
                  '@type': 'oa:TextQuoteSelector',
                  prefix: 'roit pas ',
                  exact: 'joui',
                  suffix: ' long-tons. On en avoit déjà'
                }
              ]
            }
          ]
        };

        wrapper.vm.coerceSearchHitsToBeforeMatchAfter(searchJson);

        expect(searchJson).toEqual({
          hits: [
            {
              '@type': 'search:Hit',
              annotations: [],
              before: 'roit pas ',
              match: 'joui',
              after: ' long-tons. On en avoit déjà'
            }
          ]
        });
      });
    });

    describe('fetchAnnotationResourcesFulltext', () => {
      describe('when manifest is for IIIF Presentation API v2', () => {
        it('fetches remote fulltext for all resources', async() => {
          const wrapper = factory();
          wrapper.setData({
            manifest: {
              '@context': 'http://iiif.io/api/presentation/2/context.json'
            }
          });
          const annotationJson = {
            resources: [
              { resource: { '@id': 'http://example.org/fulltext/123#char=0,9' } },
              { resource: { '@id': 'http://example.org/fulltext/123#char=10,19' } },
              { resource: { '@id': 'http://example.org/fulltext/456#char=0,9' } }
            ]
          };
          nock('http://example.org').get('/fulltext/123').reply(200, {
            type: 'FullTextResource',
            value: 'Fulltext 123'
          });
          nock('http://example.org').get('/fulltext/456').reply(200, {
            type: 'FullTextResource',
            value: 'Fulltext 456'
          });

          const fulltext = await wrapper.vm.fetchAnnotationResourcesFulltext(annotationJson);

          expect(nock.isDone()).toBe(true);
          expect(fulltext).toEqual({
            'http://example.org/fulltext/123': 'Fulltext 123',
            'http://example.org/fulltext/456': 'Fulltext 456'
          });
        });
      });

      describe('when manifest is for IIIF Presentation API v3', () => {
        it('fetches remote fulltext for all resources', async() => {
          const wrapper = factory();
          wrapper.setData({
            manifest: {
              '@context': 'http://iiif.io/api/presentation/3/context.json'
            }
          });
          const annotationJson = {
            items: [
              { body: { id: 'http://example.org/fulltext/123#char=0,9' } },
              { body: { id: 'http://example.org/fulltext/123#char=10,19' } },
              { body: { id: 'http://example.org/fulltext/456#char=0,9' } }
            ]
          };
          nock('http://example.org').get('/fulltext/123').reply(200, {
            type: 'FullTextResource',
            value: 'Fulltext 123'
          });
          nock('http://example.org').get('/fulltext/456').reply(200, {
            type: 'FullTextResource',
            value: 'Fulltext 456'
          });

          const fulltext = await wrapper.vm.fetchAnnotationResourcesFulltext(annotationJson);

          expect(nock.isDone()).toBe(true);
          expect(fulltext).toEqual({
            'http://example.org/fulltext/123': 'Fulltext 123',
            'http://example.org/fulltext/456': 'Fulltext 456'
          });
        });
      });
    });

    describe('dereferenceAnnotationResources', () => {
      describe('when manifest is for IIIF Presentation API v2', () => {
        it('extracts fulltext onto chars properties', async() => {
          const fulltext = {
            'http://example.org/fulltext/123': 'Fulltext transcription'
          };
          const wrapper = factory();
          wrapper.setData({
            manifest: {
              '@context': 'http://iiif.io/api/presentation/2/context.json'
            }
          });
          wrapper.vm.fetchAnnotationResourcesFulltext = sinon.stub().returns(fulltext);
          const annotationJson = {
            resources: [
              { resource: { '@id': 'http://example.org/fulltext/123#char=0,7' } },
              { resource: { '@id': 'http://example.org/fulltext/123#char=9,21' } }
            ]
          };

          await wrapper.vm.dereferenceAnnotationResources(annotationJson);

          expect(annotationJson.resources).toEqual([
            { resource: { '@id': 'http://example.org/fulltext/123#char=0,7', chars: 'Fulltext' } },
            { resource: { '@id': 'http://example.org/fulltext/123#char=9,21', chars: 'transcription' } }
          ]);
        });
      });

      describe('when manifest is for IIIF Presentation API v3', () => {
        it('extracts fulltext onto body properties', async() => {
          const wrapper = factory();
          wrapper.setData({
            manifest: {
              '@context': 'http://iiif.io/api/presentation/3/context.json'
            }
          });
          const fulltext = {
            'http://example.org/fulltext/123': 'Fulltext transcription'
          };
          wrapper.vm.fetchAnnotationResourcesFulltext = sinon.stub().returns(fulltext);
          const annotationJson = {
            items: [
              { body: { id: 'http://example.org/fulltext/123#char=0,7' } },
              { body: { id: 'http://example.org/fulltext/123#char=9,21' } }
            ],
            language: 'en'
          };

          await wrapper.vm.dereferenceAnnotationResources(annotationJson);

          expect(annotationJson.items).toEqual([
            { body: { value: 'Fulltext', type: 'TextualBody', language: 'en', format: 'text/plain' } },
            { body: { value: 'transcription', type: 'TextualBody', language: 'en', format: 'text/plain' } }
          ]);
        });
      });
    });

    describe('memoiseImageToCanvasMap', () => {
      const canvasId = 'https://iiif.europeana.eu/presentation/123/abc/canvas/p1';
      const imageUrl = 'https://iiif.europeana.eu/image/123/abc/default.jpg';

      describe('when manifest is for IIIF Presentation API v2', () => {
        const manifest = {
          '@context': 'http://iiif.io/api/presentation/2/context.json',
          sequences: [{ canvases: [{ '@id': canvasId, images: [{ resource: { '@id': imageUrl } }] }] }]
        };

        it('memoises image to canvas map', () => {
          const wrapper = factory({ data: { manifest } });

          wrapper.vm.memoiseImageToCanvasMap();

          expect(wrapper.vm.imageToCanvasMap).toEqual({
            [imageUrl]: canvasId
          });
        });
      });

      describe('when manifest is for IIIF Presentation API v3', () => {
        const manifest = {
          '@context': 'http://iiif.io/api/presentation/3/context.json',
          items: [{ id: canvasId, items: [{ items: [{ body: { id: imageUrl } }] }] }]
        };

        it('does not memoise image to canvas map', () => {
          const wrapper = factory({ data: { manifest } });

          wrapper.vm.memoiseImageToCanvasMap();

          expect(wrapper.vm.imageToCanvasMap).toEqual({});
        });
      });
    });

    describe('postUpdatedDownloadLinkMessage', () => {
      const pageId = 'https://iiif.europeana.eu/presentation/123/abc/canvas/p1';
      const imageUrl = 'https://iiif.europeana.eu/image/123/abc/default.jpg';

      describe('when manifest is for IIIF Presentation API v2', () => {
        const manifest = {
          '@context': 'http://iiif.io/api/presentation/2/context.json',
          sequences: [{ canvases: [{ '@id': pageId, images: [{ resource: { '@id': imageUrl } }] }] }]
        };

        it('posts image URL from sequences canvas matching page ID', () => {
          const wrapper = factory({ data: { manifest } });
          sinon.spy(window.parent, 'postMessage');

          wrapper.vm.postUpdatedDownloadLinkMessage(pageId);

          expect(window.parent.postMessage.calledWith(
            {
              event: 'updateDownloadLink',
              id: imageUrl
            },
            'http://localhost'
          )).toBe(true);
        });
      });

      describe('when manifest is for IIIF Presentation API v3', () => {
        const manifest = {
          '@context': 'http://iiif.io/api/presentation/3/context.json',
          items: [{ id: pageId, items: [{ items: [{ body: { id: imageUrl } }] }] }]
        };

        it('posts image URL from canvas item matching page ID', () => {
          const wrapper = factory({ data: { manifest } });
          sinon.spy(window.parent, 'postMessage');

          wrapper.vm.postUpdatedDownloadLinkMessage(pageId);

          expect(window.parent.postMessage.calledWith(
            {
              event: 'updateDownloadLink',
              id: imageUrl
            },
            'http://localhost'
          )).toBe(true);
        });
      });
    });
  });
});
