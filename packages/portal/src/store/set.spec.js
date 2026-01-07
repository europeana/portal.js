import store from '@/store/set';
import sinon from 'sinon';

const likesId = 'http://data.europeana.eu/set/likesset';
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
