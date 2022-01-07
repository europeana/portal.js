import * as store from '@/store/collections/fashion';

const state = {
  apiParams: {},
  facets: []
};

describe('store/collections/fashion', () => {
  describe('getters', () => {
    describe('apiParams', () => {
      it('includes CREATOR in facet param', () => {
        expect(store.getters.apiParams(state).facet).toContain('CREATOR,');
      });

      it('includes proxy_dc_format.en in facet param', () => {
        expect(store.getters.apiParams(state).facet).toContain('proxy_dc_format.en,');
      });

      it('includes proxy_dcterms_medium.en in facet param', () => {
        expect(store.getters.apiParams(state).facet).toContain('proxy_dcterms_medium.en,');
      });

      it('includes proxy_dc_type.en in facet param', () => {
        expect(store.getters.apiParams(state).facet).toContain('proxy_dc_type.en,');
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
        expect(facets[0].fields.length).toBe(2);
        expect(facets[1].fields.length).toBe(1);
        expect(facets[2].fields.length).toBe(1);
        expect(facets[3].fields.length).toBe(1);
      });
    });

    describe('formatFacetFieldLabel', () => {
      it('formats the Fashion facet field labels', () => {
        expect(store.getters.formatFacetFieldLabel()('CREATOR', '"Missoni \\(Designer\\)"')).toBe('"Missoni"');
        expect(store.getters.formatFacetFieldLabel()('proxy_dc_type.en', '"Object Type\\: fabric"')).toBe('"fabric"');
        expect(store.getters.formatFacetFieldLabel()('proxy_dc_format.en', '"Technique\\: weave"')).toBe('"weave"');
        expect(store.getters.formatFacetFieldLabel()('proxy_dcterms_medium.en', '"Material\\: cotton"')).toBe('"cotton"');
      });
    });
  });
});
