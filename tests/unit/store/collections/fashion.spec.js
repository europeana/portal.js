import * as store from '../../../../store/collections/fashion';

describe('store/collections/fashion', () => {
  describe('getters', () => {
    describe('apiParams', () => {
      const state = {
        apiParams: {}
      };

      it('includes CREATOR in facet param', () => {
        store.getters.apiParams(state).facet.should.startWith('CREATOR,');
      });
    });
  });
});
