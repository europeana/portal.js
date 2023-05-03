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
    $apis: {
      record: {
        mediaProxyUrl: (url, itemId) => `Proxy ${itemId} ${url}`
      }
    },
    $axios: axios,
    $i18n: {
      locale: 'en'
    }
  }
});

describe('pages/iiif/index.vue', () => {
  beforeEach(() => {
    window.Mirador = {
      viewer: sinon.stub().returns({
        store: {
          dispatch: sinon.stub(),
          getState: sinon.stub().returns({ windows: { '001': {} },
            companionWindows: ['companionWindowId001'] }),
          subscribe: sinon.stub()
        }
      }),
      actions: {
        fetchSearch: sinon.stub(),
        setWindowThumbnailPosition: sinon.stub(),
        updateWindow: sinon.stub()
      }
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

    describe('proxyProviderMedia', () => {
      it('rewrites painting-motivation annotation IDs to use media proxy', () => {
        const wrapper = factory();
        const manifestJson = {
          homepage: [
            {
              id: 'https://www.europeana.eu/item/123/abc'
            }
          ],
          items: [
            {
              items: [
                {
                  items: [
                    {
                      motivation: 'painting',
                      body: {
                        id: 'http://www.example.org/image/jpeg'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        };

        wrapper.vm.proxyProviderMedia(manifestJson);

        expect(manifestJson.items[0].items[0].items[0].body.id).toBe('Proxy /123/abc http://www.example.org/image/jpeg');
      });
    });

    describe('addAnnotationTextGranularityFilterToManifest', () => {
      describe('adding textGranularity filter to annotation ID URL', () => {
        it('defaults to "line" if none available', () => {
          const wrapper = factory();
          const manifestJson = {
            items: [
              {
                annotations: [
                  { id: 'https://example.org/anno1' },
                  { id: 'https://example.org/anno2?format=3' }
                ]
              }
            ]
          };

          wrapper.vm.addAnnotationTextGranularityFilterToManifest(manifestJson);

          expect(manifestJson.items[0].annotations[0].id.endsWith('?textGranularity=line')).toBe(true);
          expect(manifestJson.items[0].annotations[1].id.endsWith('&textGranularity=line')).toBe(true);
        });
        it('favours "line" if available', () => {
          const wrapper = factory();
          const manifestJson = {
            items: [
              {
                annotations: [
                  { id: 'https://example.org/anno1', textGranularity: ['page', 'line'] },
                  { id: 'https://example.org/anno2?format=3', textGranularity: ['line', 'block'] }
                ]
              }
            ]
          };

          wrapper.vm.addAnnotationTextGranularityFilterToManifest(manifestJson);

          expect(manifestJson.items[0].annotations[0].id.endsWith('?textGranularity=line')).toBe(true);
          expect(manifestJson.items[0].annotations[1].id.endsWith('&textGranularity=line')).toBe(true);
        });

        it('picks one of the annotation\'s available granularities if not "line"', () => {
          const wrapper = factory();
          const manifestJson = {
            items: [
              {
                annotations: [
                  { id: 'https://example.org/anno1', textGranularity: ['page', 'block'] },
                  { id: 'https://example.org/anno2?format=3', textGranularity: ['block', 'page'] }
                ]
              }
            ]
          };

          wrapper.vm.addAnnotationTextGranularityFilterToManifest(manifestJson);

          expect(manifestJson.items[0].annotations[0].id.endsWith('?textGranularity=page')).toBe(true);
          expect(manifestJson.items[0].annotations[1].id.endsWith('&textGranularity=block')).toBe(true);
        });
      });

      it('memoises and stores the available granularities for the entire manifest', () => {
        const wrapper = factory();
        const manifestJson = {
          items: [
            {
              annotations: [
                { id: 'https://example.org/anno1', textGranularity: ['page', 'block'] },
                { id: 'https://example.org/anno2?format=3', textGranularity: ['block', 'line'] }
              ]
            }
          ]
        };

        wrapper.vm.addAnnotationTextGranularityFilterToManifest(manifestJson);

        expect(wrapper.vm.manifestAnnotationTextGranularities).toEqual(['page', 'line']);
      });
    });

    describe('filterSearchHitsByTextGranularity', () => {
      it('filters search hits with textGranularity in dcType by pre-selected granularities', () => {
        const manifestAnnotationTextGranularities = ['line'];
        const wrapper = factory({ data: { manifestAnnotationTextGranularities } });
        const searchJson = {
          resources: [
            {
              '@id': 'https://example.org/anno1',
              dcType: 'block'
            },
            {
              '@id': 'https://example.org/anno2',
              dcType: 'line'
            },
            {
              '@id': 'https://example.org/anno3',
              dcType: 'page'
            }
          ],
          hits: [
            {
              annotations: ['https://example.org/anno1']
            },
            {
              annotations: ['https://example.org/anno2']
            },
            {
              annotations: ['https://example.org/anno3']
            }
          ]
        };

        wrapper.vm.filterSearchHitsByTextGranularity(searchJson);

        expect(searchJson.hits.length).toBe(1);
        expect(searchJson.hits[0].annotations[0]).toBe('https://example.org/anno2');
      });

      it('keeps search hits with no textGranularity in dcType', () => {
        const manifestAnnotationTextGranularities = ['line'];
        const wrapper = factory({ data: { manifestAnnotationTextGranularities } });
        const searchJson = {
          resources: [
            {
              '@id': 'https://example.org/anno1'
            },
            {
              '@id': 'https://example.org/anno2'
            }
          ],
          hits: [
            {
              annotations: ['https://example.org/anno1']
            },
            {
              annotations: ['https://example.org/anno2']
            }
          ]
        };

        wrapper.vm.filterSearchHitsByTextGranularity(searchJson);

        expect(searchJson.hits.length).toBe(2);
      });
    });

    describe('coerceAnnotationsOnToCanvases', () => {
      it('coerces items `target` attribute to canvas ID', async() => {
        const wrapper = factory();
        await wrapper.setData({
          imageToCanvasMap: {
            'https://example.org/image/123.jpg': 'http://example.org/presentation/123/canvas/p1'
          }
        });
        const json = {
          items: [{
            target: 'https://example.org/image/123.jpg#xywh=1,0,90,100'
          }]
        };

        wrapper.vm.coerceAnnotationsOnToCanvases(json);

        expect(json.items[0].target).toBe('http://example.org/presentation/123/canvas/p1#xywh=1,0,90,100');
      });

      it('coerces resources `on` attribute to canvas ID', async() => {
        const wrapper = factory();
        await wrapper.setData({
          imageToCanvasMap: {
            'https://example.org/image/123.jpg': 'http://example.org/presentation/123/canvas/p1'
          }
        });
        const json = {
          resources: [{
            on: ['https://example.org/image/123.jpg#xywh=1,0,90,100']
          }]
        };

        wrapper.vm.coerceAnnotationsOnToCanvases(json);

        expect(json.resources[0].on).toEqual(['http://example.org/presentation/123/canvas/p1#xywh=1,0,90,100']);
      });
    });

    describe('postprocessMiradorReceiveManifest', () => {
      describe('addAnnotationTextGranularityFilterToManifest post-processor', () => {
        it('is called if for a Europeana manifest', () => {
          const url = 'https://iiif.europeana.eu/presentation/123/abc/manifest';
          const action = { manifestJson: { id: url } };
          const wrapper = factory();
          sinon.stub(wrapper.vm, 'addAnnotationTextGranularityFilterToManifest');

          wrapper.vm.postprocessMiradorReceiveManifest(url, action);

          expect(wrapper.vm.addAnnotationTextGranularityFilterToManifest.calledWith(action.manifestJson)).toBe(true);
        });

        it('is not called if not for a Europeana manifest', () => {
          const url = 'https://iiif.example.org/presentation/123/abc/manifest';
          const action = { manifestJson: { id: url } };
          const wrapper = factory();
          sinon.stub(wrapper.vm, 'addAnnotationTextGranularityFilterToManifest');

          wrapper.vm.postprocessMiradorReceiveManifest(url, action);

          expect(wrapper.vm.addAnnotationTextGranularityFilterToManifest.called).toBe(false);
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

    describe('postprocessMiradorRequest', () => {
      describe('upon receiving annotations', () => {
        describe('when viewport is larger than mobile', () => {
          it('allows and opens the side bar', async() => {
            const url = 'https://iiif.europeana.eu/presentation/123/abc/manifest';
            const manifest = {
              '@context': 'http://iiif.io/api/presentation/2/context.json'
            };
            const wrapper = factory({ data: { manifest } });

            await wrapper.vm.$nextTick();

            const action = { annotationJson: { resources: [{}] },
              type: 'mirador/RECEIVE_ANNOTATION' };
            wrapper.vm.postprocessMiradorRequest(url, action);

            expect(window.Mirador.actions.updateWindow.calledWith(
              wrapper.vm.miradorWindowId, {
                allowWindowSideBar: true,
                sideBarOpen: true
              })).toBe(true);
          });
        });
        describe('when viewport is mobile', () => {
          const originalWindowWidth = window.innerWidth;
          it('allows but does not open the side bar', async() => {
            window.innerWidth = 300;
            const url = 'https://iiif.europeana.eu/presentation/123/abc/manifest';
            const manifest = {
              '@context': 'http://iiif.io/api/presentation/2/context.json'
            };
            const wrapper = factory({ data: { manifest } });

            await wrapper.vm.$nextTick();
            const action = { annotationJson: { resources: [{}] },
              type: 'mirador/RECEIVE_ANNOTATION' };
            wrapper.vm.postprocessMiradorRequest(url, action);

            expect(window.Mirador.actions.updateWindow.calledWith(
              wrapper.vm.miradorWindowId, {
                allowWindowSideBar: true
              })).toBe(true);
          });
          describe('and a search query is passed', () => {
            it('allows and opens the side bar', async() => {
              window.innerWidth = 300;
              const url = 'https://iiif.europeana.eu/presentation/123/abc/manifest';
              const manifest = {
                '@context': 'http://iiif.io/api/presentation/2/context.json',
                service: {
                  '@context': 'http://iiif.io/api/search/1/context.json',
                  '@id': 'https://iiif.europeana.eu/presentation/123/abc/search'
                }
              };
              const wrapper = factory({ data: { manifest, searchQuery: 'example' } });
              await wrapper.vm.$nextTick();

              const action = { annotationJson: { resources: [{}] },
                type: 'mirador/RECEIVE_ANNOTATION' };

              wrapper.vm.postprocessMiradorRequest(url, action);

              expect(window.Mirador.actions.updateWindow.calledWith(
                wrapper.vm.miradorWindowId, {
                  allowWindowSideBar: true,
                  sideBarOpen: true
                })).toBe(true);
            });
          });
          window.innerWidth = originalWindowWidth;
        });
      });
    });
  });

  describe('watch', () => {
    describe('numberOPages', () => {
      describe('when there are multiple pages', () => {
        it('sets the thumbnails position and enables the top menu button', async() => {
          const manifest = {
            '@context': 'http://iiif.io/api/presentation/2/context.json',
            sequences: [{ canvases: [{}] }]
          };
          const wrapper = factory({ data: { manifest } });

          wrapper.vm.manifest.sequences = [{ canvases: [{}] }, { canvases: [{}] }];
          await wrapper.vm.$nextTick();

          expect(wrapper.vm.mirador.store.dispatch.calledWith(window.Mirador.actions.setWindowThumbnailPosition(wrapper.vm.miradorWindowId, 'far-right'))).toBe(true);
          expect(wrapper.vm.mirador.store.dispatch.calledWith(window.Mirador.actions.updateWindow(wrapper.vm.miradorWindowId, { allowTopMenuButton: true }))).toBe(true);
        });
      });
    });
  });
});
