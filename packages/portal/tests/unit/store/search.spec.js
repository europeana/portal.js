import store from '@/store/search';

describe('store/search', () => {
  describe('getters', () => {
    describe('activeView', () => {
      it('returns view from state if set', () => {
        const state = { view: 'list' };

        const activeView = store.getters.activeView(state);

        expect(activeView).toBe(state.view);
      });

      it('defaults to grid view', () => {
        const state = {};

        const activeView = store.getters.activeView(state);

        expect(activeView).toBe('grid');
      });
    });
  });
});
