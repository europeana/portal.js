import * as store from '../../../../store/collections/fashion';

const state = {
  apiParams: {},
  facets: []
};

describe('store/collections/fashion', () => {
  describe('getters', () => {
    describe('apiParams', () => {
      it('includes CREATOR in facet param', () => {
        store.getters.apiParams(state).facet.should.include('CREATOR,');
      });

      it('includes proxy_dc_format.en in facet param', () => {
        store.getters.apiParams(state).facet.should.include('proxy_dc_format.en,');
      });

      it('includes proxy_dcterms_medium.en in facet param', () => {
        store.getters.apiParams(state).facet.should.include('proxy_dcterms_medium.en,');
      });

      it('includes proxy_dc_type.en in facet param', () => {
        store.getters.apiParams(state).facet.should.include('proxy_dc_type.en,');
      });
    });

    describe('facets', () => {
      const state = {
        facets: [
          {
            name: 'CREATOR',
            fields: [
              { label: '"Missoni \\(Designer\\)"' },
              { label: '"Emilio Pucci \\(Designer\\)"' },
              { label: '"Holmén, Erik \\(Photographer\\)"' }
            ]
          },
          {
            name: 'proxy_dc_type.en',
            fields: [
              { label: '"Object Type\\: fabric"' },
              { label: '"Manuscript"' }
            ]
          },
          {
            name: 'proxy_dc_format.en',
            fields: [
              { label: '"Technique\\: weave"' },
              { label: '"Color\\: red"' }
            ]
          },
          {
            name: 'proxy_dcterms_medium.en',
            fields: [
              { label: '"Material\\: cotton"' },
              { label: '"Paper"' }
            ]
          }
        ]
      };

      it('filters the Fashion facet fields', () => {
        const facets = store.getters.facets(state);
        facets[0].fields.length.should.eq(2);
        facets[1].fields.length.should.eq(1);
        facets[2].fields.length.should.eq(1);
        facets[3].fields.length.should.eq(1);
      });
    });

    describe('formatFacetFieldLabel', () => {
      it('formats the Fashion facet field labels', () => {
        store.getters.formatFacetFieldLabel()('CREATOR', '"Missoni \\(Designer\\)"').should.eq('"Missoni"');
        store.getters.formatFacetFieldLabel()('proxy_dc_type.en', '"Object Type\\: fabric"').should.eq('"fabric"');
        store.getters.formatFacetFieldLabel()('proxy_dc_format.en', '"Technique\\: weave"').should.eq('"weave"');
        store.getters.formatFacetFieldLabel()('proxy_dcterms_medium.en', '"Material\\: cotton"').should.eq('"cotton"');
      });
    });
  });
});
