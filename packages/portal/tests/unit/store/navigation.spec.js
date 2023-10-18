import store from '@/store/navigation';

describe('store/navigation', () => {
  describe('mutations', () => {
    describe('updateBrowserNative()', () => {
      it('sets the browserNative state to the passed value', () => {
        const state = { browserNative: false };
        store.mutations.updateBrowserNative(state, true);
        expect(state.browserNative).toEqual(true);
      });
    });
  });
});
