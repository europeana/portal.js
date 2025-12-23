import store from '@/store/entity';

const entity = { id: 'http://data.europeana.eu/concept/001' };
const id = 'http://data.europeana.eu/concept/001';
const pinned = ['http://data.europeana.eu/item/123/abc', 'http://data.europeana.eu/item/234/abc'];
const itemId = '/123/abc';
const itemIdNotPinned = '/345/abc';
const entityDescription = { en: 'example entity description' };

describe('store/entity', () => {
  describe('mutations', () => {
    describe('setEntity()', () => {
      it('sets the entity state', () => {
        const state = { entity: null };
        store.mutations.setEntity(state, entity);
        expect(state.entity).toEqual(entity);
      });
    });
    describe('setId()', () => {
      it('sets the id state', () => {
        const state = { id: null };
        store.mutations.setId(state, id);
        expect(state.id).toEqual(id);
      });
    });
    describe('setPinned()', () => {
      describe('when value passed in', () => {
        it('sets the pinned state', () => {
          const state = { pinned: null };
          store.mutations.setPinned(state, pinned);
          expect(state.pinned).toEqual(pinned);
        });
      });
      describe('when no value passed in', () => {
        it('sets the pinned state to an empty array', () => {
          const state = { pinned: null };
          store.mutations.setPinned(state);
          expect(state.pinned).toEqual([]);
        });
      });
    });
    describe('setEntityDescription()', () => {
      it('sets the note on the entity state', () => {
        const state = { entity: {} };
        store.mutations.setEntityDescription(state, entityDescription);
        expect(state.entity.note).toEqual(entityDescription);
      });
    });
    describe('setEditable()', () => {
      it('sets editable state', () => {
        const state = { editable: false };
        store.mutations.setEditable(state, true);
        expect(state.editable).toEqual(true);
      });
    });
    describe('setBestItemsSetId', () => {
      it('sets best items set ID state, numeric part only', () => {
        const state = {};
        store.mutations.setBestItemsSetId(state, 'http://data.europeana.eu/set/1');
        expect(state.bestItemsSetId).toEqual('1');
      });
    });
  });

  describe('getters', () => {
    describe('isPinned()', () => {
      describe('when there are pinned items', () => {
        it('returns whether the item is pinned', () => {
          const state = { pinned };

          const isPinned = store.getters.isPinned(state)(itemId);
          const isNotPinned = store.getters.isPinned(state)(itemIdNotPinned);

          expect(isPinned).toEqual(true);
          expect(isNotPinned).toEqual(false);
        });
      });
      describe('when there are no pinned items', () => {
        it('returns false', () => {
          const state = {};

          const isPinned = store.getters.isPinned(state)(itemId);

          expect(isPinned).toEqual(false);
        });
      });
    });
  });
});
