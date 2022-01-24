import store from '@/store/collections/newspaper';

describe('store/collections/newspaper', () => {
  describe('getters', () => {
    describe('apiOptions', () => {
      describe('when api param is "fulltext"', () => {
        const getters = {
          apiParams: {
            api: 'fulltext'
          }
        };

        it('sets url option to Newpapers API', () => {
          expect(store.getters.apiOptions({}, getters).url).toBe('https://newspapers.eanadev.org/api/v2');
        });
      });

      describe('when api param is "metadata"', () => {
        const getters = {
          apiParams: {
            api: 'metadata'
          }
        };

        it('does not set url option to Newpapers API', () => {
          expect(store.getters.apiOptions({}, getters).url).toBe(undefined);
        });
      });
    });

    describe('apiParams', () => {
      describe('when api param is absent', () => {
        const state = {
          apiParams: {}
        };

        it('defaults api param to "fulltext"', () => {
          expect(store.getters.apiParams(state).api).toBe('fulltext');
        });
      });

      describe('when api param is "fulltext"', () => {
        const state = {
          apiParams: {
            api: 'fulltext',
            qf: ['contentTier:(1 OR 2 OR 3 OR 4)']
          }
        };

        it('respects contentTier filter', () => {
          expect(store.getters.apiParams(state).qf).toEqual(['contentTier:(1 OR 2 OR 3 OR 4)']);
        });
      });
    });
  });
});
