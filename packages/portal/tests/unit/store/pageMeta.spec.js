import store from '@/store/pageMeta.js';

describe('store/pageMeta.js', () => {
  describe('state', () => {
    it('has data object', () => {
      expect(store.state().data).toEqual({});
    });
  });

  describe('mutations', () => {
    describe('set', () => {
      it('stores to state as `data`', () => {
        const state = { data: {} };
        const data = { title: 'home' };

        store.mutations.set(state, data);

        expect(state.data).toEqual(data);
      });

      it('defaults value to blank object', () => {
        const state = { data: {} };
        const data = undefined;

        store.mutations.set(state, data);

        expect(state.data).toEqual({});
      });
    });
  });
});
