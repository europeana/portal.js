import { shallowMountNuxt } from '../../utils';
import axios from 'axios';
import nock from 'nock';
import sinon from 'sinon';

import page from '@/pages/iiif/index';

const factory = () => shallowMountNuxt(page, {
  data() {
    return {
      uri: 'http://example.org/iiif/manifest.json'
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

  describe('methods', () => {
    describe('coerceResourceOnImagesToCanvases', () => {
      it('coerces resource\'s `on` attribute to canvas ID', async() => {
        const wrapper = factory();
        await wrapper.setData({
          imageToCanvasMap: {
            'https://example.org/image/123.jpg': 'http://example.org/presentation/123/canvas/p1'
          }
        });
        const resource = {
          on: ['https://example.org/image/123.jpg#xywh=1,0,90,100']
        };

        wrapper.vm.coerceResourceOnImagesToCanvases(resource);

        expect(resource).toEqual({
          on: ['http://example.org/presentation/123/canvas/p1#xywh=1,0,90,100']
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
      it('fetches remote fulltext for all resources', async() => {
        const wrapper = factory();
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

    describe('dereferenceAnnotationResources', () => {
      it('extracts fulltext onto chars properties', async() => {
        const fulltext = {
          'http://example.org/fulltext/123': 'Fulltext transcription'
        };
        const wrapper = factory();
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
  });
});
