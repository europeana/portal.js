import * as store from '../../../../store/collections/fashion';

describe('store/collections/fashion', () => {
  describe('getters', () => {
    describe('apiParams', () => {
      const state = {
        apiParams: {},
        facets: []
      };

      const payload = [
        'facets',
        [
          { name: 'CREATOR',
            fields: [
              { label: '"Missoni (Designer)"' },
              { label: '"Emilio Pucci (Designer)"' },
              { label: '"Holmén, Erik (Photographer)"' }
            ]
          }
        ]
      ];

      it('includes CREATOR in facet param', () => {
        store.getters.apiParams(state).facet.should.startWith('CREATOR,');
      });

      it('filters the Fashion facets', () => {
        const beforeFilter = payload[1][0].fields.length;
        store.mutations.filter(state, payload);
        state.facets[0].fields.length.should.not.eq(beforeFilter);
      });
    });
  });
});
