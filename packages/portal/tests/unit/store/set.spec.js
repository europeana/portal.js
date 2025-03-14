import store from '@/store/set';
import sinon from 'sinon';

const likesId = 'http://data.europeana.eu/set/likesset';
const likedItems = [{ id: 'item001' }];
const active = { id: 'set001', items: [] };
const activeRecommendations = [{ id: 'recommendation001' }, { id: 'recommendation002' }];

describe('store/set', () => {
  describe('mutations', () => {
    describe('setLikesId()', () => {
      it('sets the likesId state', () => {
        const state = { likesId: null };
        store.mutations.setLikesId(state, likesId);
        expect(state.likesId).toEqual(likesId);
      });
    });
    describe('setLikedItems()', () => {
      it('sets the likedItems state', () => {
        const state = { likedItems: null, likedItemIds: [] };
        store.mutations.setLikedItems(state, likedItems);
        expect(state.likedItems).toEqual(likedItems);
      });
      it('sets the likedItemIds state when there are any', () => {
        const state = { likedItems: null, likedItemIds: [] };
        store.mutations.setLikedItems(state, likedItems);
        expect(state.likedItemIds).toEqual(likedItems.map(item => item.id));
      });
      it('resets the likedItemIds state when there is a falsy value', () => {
        const state = { likedItems: [{ id: '006' }], likedItemIds: ['006'] };
        store.mutations.setLikedItems(state, null);
        expect(state.likedItems).toEqual(null);
        expect(state.likedItemIds).toEqual([]);
      });
    });
    describe('setSelected', () => {
      it('sets the selectedItems state', () => {
        const state = { selectedItems: [] };
        store.mutations.setSelected(state, ['123/abc']);
        expect(state.selectedItems).toEqual(['123/abc']);
      });
    });
    describe('like()', () => {
      it('pushes single liked item id to likedItemIds state', () => {
        const state = { likedItemIds: ['006'] };

        store.mutations.like(state, '007');

        expect(state.likedItemIds).toEqual(['006', '007']);
      });

      it('pushes multiple liked item ids to likedItemIds state', () => {
        const state = { likedItemIds: ['006'] };

        store.mutations.like(state, ['007', '008']);

        expect(state.likedItemIds).toEqual(['006', '007', '008']);
      });
    });
    describe('unlike()', () => {
      it('removes the unliked item id from likedItemIds state', () => {
        const state = { likedItems: [{ id: '006' }], likedItemIds: ['006', '007'] };
        store.mutations.unlike(state, '007');
        expect(state.likedItemIds).toEqual(['006']);
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

      it('removes any that are already in the active set', () => {
        const state = { activeRecommendations: [], active: { items: [activeRecommendations[0]] } };
        store.mutations.setActiveRecommendations(state, activeRecommendations);
        expect(state.activeRecommendations.length).toBe(1);
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

    describe('like()', () => {
      describe('when amount of likes limit is reached', () => {
        it('throws an error', async() => {
          const likedItems = Array.from(Array(100).keys()).map(item => {
            return { id: `${item}` };
          });
          const state = { likedItems };

          await expect(store.actions.like({ dispatch, commit, state }, itemId)).rejects.toThrowError();
          await expect(store.actions.like({ dispatch, state, commit }, itemId)).rejects.toEqual(new Error('100 likes'));
          expect(dispatch.calledWith('fetchLikes')).toBe(true);
        });
      });

      it('adds to likes set via $apis.set, then commits with "like"', async() => {
        store.actions.$apis.set.insertItems = sinon.stub().resolves({});
        const state = { likesId: setId };

        await store.actions.like({ dispatch, commit, state }, itemId);

        expect(store.actions.$apis.set.insertItems.calledWith(state.likesId, [itemId])).toBe(true);
        expect(commit.calledWith('like', [itemId])).toBe(true);
      });
    });

    describe('unlike()', () => {
      it('removes from likes set via $apis.set, then commits with "unlike"', async() => {
        store.actions.$apis.set.deleteItems = sinon.stub().resolves({});
        const state = { likesId: setId };

        await store.actions.unlike({ dispatch, commit, state }, itemId);

        expect(store.actions.$apis.set.deleteItems.calledWith(state.likesId, itemId)).toBe(true);
        expect(commit.calledWith('unlike', itemId)).toBe(true);
      });
      describe('when api call errors', () => {
        it('fetches likes', async() => {
          store.actions.$apis.set.deleteItems = sinon.stub().rejects(new Error('API error'));
          const state = { likesId: setId };

          await expect(store.actions.unlike({ dispatch, commit, state }, itemId)).rejects.toThrowError();
          expect(dispatch.calledWith('fetchLikes')).toBe(true);
        });
      });
    });

    describe('fetchLikes()', () => {
      describe('without likesId in state', () => {
        it('does not fetch likes via $apis.set', async() => {
          store.actions.$apis.set.get = sinon.stub();
          const state = {};

          await store.actions.fetchLikes({ state, commit });

          expect(store.actions.$apis.set.get.called).toBe(false);
        });
      });

      describe('with likesId in state', () => {
        it('fetches likes via $apis.set, then commits the items with "setLikedItems"', async() => {
          store.actions.$apis.set.get = sinon.stub().resolves(set);
          const state = { likesId: setId };

          await store.actions.fetchLikes({ state, commit });

          expect(store.actions.$apis.set.get.calledWith(setId, sinon.match.any)).toBe(true);
          expect(commit.calledWith('setLikedItems', set.items)).toBe(true);
        });
      });
    });

    describe('fetchActive()', () => {
      it('fetches the active set and items via Set API, then commits it with "setActive"', async() => {
        store.actions.$apis.set.get = sinon.stub().resolves(set);
        store.actions.$apis.set.getItems = sinon.stub().resolves([]);

        const state = { activeId: setId };
        await store.actions.fetchActive({ commit, state });

        expect(store.actions.$apis.set.get.calledWith(setId)).toBe(true);
        expect(commit.calledWith('setActive', { ...set, items: [] })).toBe(true);
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
  });
});
