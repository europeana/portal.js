import store from '@/store/entity';

const id = 'http://data.europeana.eu/concept/001';

describe('store/entity', () => {
  describe('mutations', () => {
    describe('setId()', () => {
      it('sets the id state', () => {
        const state = { id: null };
        store.mutations.setId(state, id);
        expect(state.id).toEqual(id);
      });
    });
    describe('setEditable()', () => {
      it('sets editable state', () => {
        const state = { editable: false };
        store.mutations.setEditable(state, true);
        expect(state.editable).toEqual(true);
      });
    });
  });
});
