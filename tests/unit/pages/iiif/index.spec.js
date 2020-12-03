import { shallowMountNuxt } from '../../utils';
import axios from 'axios';
import nock from 'nock';
import sinon from 'sinon';

import page from '../../../../pages/iiif/index';

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
  beforeEach('stub Mirador', () => {
    window.Mirador = {
      viewer: sinon.stub().returns({
        store: {
          subscribe: sinon.stub()
        }
      })
    };
  });

  afterEach('restore stubs', () => {
    sinon.restore();
  });

  describe('methods', () => {
    describe('coerceAnnotationToCanvasId', () => {
      it('coerces `on` attribute to canvas ID', () => {
        const wrapper = factory();
        wrapper.setData({
          page: 'http://example.org/presentation/123/canvas/p1'
        });
        const annotationJson = {
          resources: [
            { on: ['https://example.org/image/123.jpg#xywh=1,0,90,100'] }
          ]
        };

        wrapper.vm.coerceAnnotationToCanvasId(annotationJson);

        annotationJson.resources.should.eql([
          { on: ['http://example.org/presentation/123/canvas/p1#xywh=1,0,90,100'] }
        ]);
      });
    });

    describe('filterAnnotationResources', () => {
      it('filters to line-level annotations with char fragment selector', () => {
        const wrapper = factory();
        const annotationJson = {
          resources: [
            { dcType: 'Page', resource: { '@id': 'http://example.org/fulltext/123' } },
            { dcType: 'Line', resource: { '@id': 'http://example.org/fulltext/123#char=0,9' } },
            { dcType: 'Line', resource: { '@id': 'http://example.org/fulltext/123#char=10,19' } },
            { dcType: 'Line', resource: { '@id': 'http://example.org/fulltext/123' } },
            { dcType: 'Block', resource: { '@id': 'http://example.org/fulltext/123#char=0,19' } }
          ]
        };

        wrapper.vm.filterAnnotationResources(annotationJson);

        annotationJson.resources.should.eql([
          { dcType: 'Line', resource: { '@id': 'http://example.org/fulltext/123#char=0,9' } },
          { dcType: 'Line', resource: { '@id': 'http://example.org/fulltext/123#char=10,19' } }
        ]);
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

        nock.isDone().should.be.true;
        fulltext.should.eql({
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

        annotationJson.resources.should.eql([
          { resource: { '@id': 'http://example.org/fulltext/123#char=0,7', chars: 'Fulltext' } },
          { resource: { '@id': 'http://example.org/fulltext/123#char=9,21', chars: 'transcription' } }
        ]);
      });
    });
  });
});
