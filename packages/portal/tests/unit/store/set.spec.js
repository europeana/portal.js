import store from '@/store/set';
import sinon from 'sinon';

const likesId = 'http://data.europeana.eu/set/likesset';
const active = { id: 'set001', items: [] };
const activeRecommendations = [{ id: 'recommendation001' }, { id: 'recommendation002' }];

describe('store/set', () => {
  describe('getters', () => {
    describe('activeSetItemIds', () => {
      it('returns the IDs of the active set items', () => {
        const state = { active: { items: [{ id: 'item1' }, { id: 'item2' }] } };

        const activeSetItemIds = store.getters.activeSetItemIds(state);

        expect(activeSetItemIds).toEqual(['item1', 'item2']);
      });
    });

    describe('someActiveSetItemsSelected', () => {
      it('is `true` when some active set items are selected', () => {
        const state = {
          active: { items: [{ id: 'item1' }, { id: 'item2' }] },
          selectedItems: ['item2']
        };
        const getters = { activeSetItemIds: store.getters.activeSetItemIds(state) };

        const someActiveSetItemsSelected = store.getters.someActiveSetItemsSelected(state, getters);

        expect(someActiveSetItemsSelected).toBe(true);
      });

      it('is `false` when no active set items are selected', () => {
        const state = {
          active: { items: [{ id: 'item1' }, { id: 'item2' }] },
          selectedItems: ['item3']
        };
        const getters = { activeSetItemIds: store.getters.activeSetItemIds(state) };

        const someActiveSetItemsSelected = store.getters.someActiveSetItemsSelected(state, getters);

        expect(someActiveSetItemsSelected).toBe(false);
      });
    });
  });

  describe('mutations', () => {
    describe('setLikesId()', () => {
      it('sets the likesId state', () => {
        const state = { likesId: null };
        store.mutations.setLikesId(state, likesId);
        expect(state.likesId).toEqual(likesId);
      });
    });
    describe('setSelected', () => {
      it('sets the selectedItems state', () => {
        const state = { selectedItems: [] };
        store.mutations.setSelected(state, ['123/abc']);
        expect(state.selectedItems).toEqual(['123/abc']);
      });
    });
    describe('setActive()', () => {
      it('sets the setActive state', () => {
        const state = { active: null };
        store.mutations.setActive(state, active);
        expect(state.active).toEqual(active);
      });
    });
    describe('setActiveRecommendations()', () => {
      it('sets the activeRecommendations state', () => {
        const state = { activeRecommendations: [], active: { items: [] } };
        store.mutations.setActiveRecommendations(state, activeRecommendations);
        expect(state.activeRecommendations).toEqual(activeRecommendations);
      });
    });
    describe('selectItem()', () => {
      it('adds an item to the selected items state', () => {
        const newItem = 'item001';
        const state = { selectedItems: [] };
        store.mutations.selectItem(state, newItem);
        expect(state.selectedItems).toEqual([newItem]);
      });
      describe('when item is already selected', () => {
        it('does not add to the selected items state again', () => {
          const newItem = 'item001';
          const state = { selectedItems: ['item001'] };
          store.mutations.selectItem(state, newItem);
          expect(state.selectedItems).toEqual(['item001']);
        });
      });
    });
    describe('deselectItemToActive()', () => {
      it('removes an item from the selected items state', () => {
        const selectedItem = 'item002';
        const state = { selectedItems: ['item001', selectedItem, 'item003'] };
        store.mutations.deselectItem(state, selectedItem);
        expect(state.selectedItems).toEqual(['item001', 'item003']);
      });
    });
  });

  describe('actions', () => {
    const commit = sinon.spy();
    const dispatch = sinon.stub().resolves({});
    const setId = 'http://data.europeana.eu/set/123';
    const itemId = '/123/ghi';
    const userId = 'a-b-c-d-e';
    const recommendations = { items: ['/123/def', '/123/ghi'] };
    const newRecommendation = { items: ['/123/jkl'] };
    const updatedRecommendations = ['/123/def', '/123/jkl'];
    const $config = { key: 'apikey' };
    const set = {
      id: setId,
      creator: {
        id: userId
      },
      items: []
    };

    beforeEach(() => {
      commit.resetHistory();
      dispatch.resetHistory();
      store.actions.$apis = { set: { config: $config }, recommendation: {}, record: {} };
      store.actions.$auth = {};
      store.actions.app = { context: { res: {} } };
    });

    describe('fetchActive()', () => {
      const dispatch = sinon.spy();
      it('fetches the active set and items via Set API, then commits it with "setActive"', async() => {
        store.actions.$apis.set.get = sinon.stub().resolves(set);
        store.actions.$apis.set.getItems = sinon.stub().resolves([]);

        const state = { activeId: setId };
        await store.actions.fetchActive({ commit, dispatch, state });

        expect(store.actions.$apis.set.get.calledWith(setId)).toBe(true);
        expect(commit.calledWith('setActive', { ...set, items: [] })).toBe(true);
      });

      describe('when there are selected items', () => {
        it('refreshes the selected items', async() => {
          store.actions.$apis.set.get = sinon.stub().resolves(set);
          store.actions.$apis.set.getItems = sinon.stub().resolves([]);

          const state = {
            activeId: setId,
            selectedItems: ['/001/abc', '/002/abc']
          };

          await store.actions.fetchActive({ commit, dispatch, state });

          expect(dispatch.calledWith('refreshSelected')).toBe(true);
        });
      });
    });

    describe('acceptRecommendation()', () => {
      it('accepts a recommended item via $apis.recommendation, then commits the returned new item with "setActiveRecommendations"', async() => {
        const state = { activeRecommendations: recommendations.items };

        store.actions.$apis.recommendation.accept = sinon.stub().resolves(newRecommendation);

        await store.actions.reviewRecommendation({ state, commit }, { setId, itemIds: [itemId], action: 'accept' });

        expect(store.actions.$apis.recommendation.accept.calledWith('set', setId, [itemId])).toBe(true);
        expect(commit.calledWith('setActiveRecommendations', updatedRecommendations)).toBe(true);
      });
    });

    describe('rejectRecommendation()', () => {
      it('rejects a recommended item via $apis.recommendation, then commits the returned new item with "setActiveRecommendations"', async() => {
        const state = { activeRecommendations: recommendations.items };

        store.actions.$apis.recommendation.reject = sinon.stub().resolves(newRecommendation);

        await store.actions.reviewRecommendation({ state, commit }, { setId, itemIds: [itemId], action: 'reject' });

        expect(store.actions.$apis.recommendation.reject.calledWith('set', setId, [itemId])).toBe(true);
        expect(commit.calledWith('setActiveRecommendations', updatedRecommendations)).toBe(true);
      });
    });

    describe('refreshSelected()', () => {
      it('refreshes the selected items to only the active set or recommended items', async() => {
        const state = {
          active: { ...set, items: [{ id: '/002/abc' }] },
          activeRecommendations: [],
          selectedItems: ['/001/abc', '/002/abc']
        };

        await store.actions.refreshSelected({ state, commit });

        expect(commit.calledWith('setSelected', ['/002/abc'])).toBe(true);

        const stateWithSelectedRecommndations = {
          active: null,
          activeRecommendations: [{ id: '/001/abc' }],
          selectedItems: ['/001/abc', '/002/abc']
        };

        await store.actions.refreshSelected({ state: stateWithSelectedRecommndations, commit });

        expect(commit.calledWith('setSelected', ['/001/abc'])).toBe(true);
      });
    });
  });
});
