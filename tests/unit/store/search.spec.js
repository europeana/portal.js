import * as store from '../../../store/search';

describe('store/search', () => {
  describe('mutations', () => {
    describe('newQuery', () => {
      it('updates the stored query', () => {
        const state = {
          query: 'from'
        };
        store.mutations.newQuery(state, 'to');
        state.query.should.eq('to');
      });

      it('resets stored page to 1', () => {
        const state = {
          query: 'from',
          page: 10
        };
        store.mutations.newQuery(state, '');
        state.page.should.eq(1);
      });
    });
  });
});
