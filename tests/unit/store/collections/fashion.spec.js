import * as store from '../../../../store/collections/fashion';

describe('store/collections/fashion', () => {
  describe('getters', () => {
    describe('apiParams', () => {
      const state = {
        apiParams: {},
        facets: []
      };

      const facets = [
        { name: 'CREATOR',
          fields: [
            { label: 'Missoni (Designer)' },
            { label: 'Emilio Pucci (Designer)' },
            { label: 'Holmén, Erik (Photographer)' }
          ]
        }
      ];

      it('includes CREATOR in facet param', () => {
        store.getters.apiParams(state).facet.should.startWith('CREATOR,');
      });

      it('filters the Fashion facets', () => {
        store.mutations.filterFacets(state, facets);
        state.facets[0].fields.length.should.eq(2);
      });
    });
  });
});
