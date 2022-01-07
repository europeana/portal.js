import store from '@/store/set';
import sinon from 'sinon';

describe('store/set', () => {
  describe('getters', () => {
    describe('isLiked()', () => {
      it('is `true` if likedItemIds state includes item ID', () => {
        const itemId = '/123/ghi';
        const state = {
          likedItemIds: ['/123/abc', '/123/def', '/123/ghi']
        };

        const isLiked = store.getters.isLiked(state)(itemId);

        expect(isLiked).toBe(true);
      });

      it('is `false` if likedItemIds state does not include item ID', () => {
        const itemId = '/123/ghi';
        const state = {
          likedItemIds: ['/123/abc', '/123/def']
        };

        const isLiked = store.getters.isLiked(state)(itemId);

        expect(isLiked).toBe(false);
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
    const set = {
      id: setId,
      items: []
    };

    beforeEach(() => {
      commit.resetHistory();
      dispatch.resetHistory();
      store.actions.$apis = { set: {}, recommendation: {}, record: {} };
      store.actions.$auth = {};
    });

    describe('reset()', () => {
      const resetCommits = {
        setLikesId: null,
        setLikedItems: null,
        setCreations: [],
        setCurations: []
      };

      for (const commitName in resetCommits) {
        const commitValue = resetCommits[commitName];
        it(`commits "${commitName}" with ${commitValue}`, ()  => {
          store.actions.reset({ commit });

          expect(commit.calledWith(commitName, commitValue)).toBe(true);
        });
      }
    });

    describe('like()', () => {
      it('adds to likes set via $apis.set, then commits with "like"', async() => {
        store.actions.$apis.set.modifyItems = sinon.stub().resolves({});
        const state = { likesId: setId };

        await store.actions.like({ dispatch, commit, state }, itemId);

        expect(store.actions.$apis.set.modifyItems.calledWith('add', state.likesId, itemId)).toBe(true);
        expect(commit.calledWith('like', itemId)).toBe(true);
      });
    });

    describe('unlike()', () => {
      it('removes from likes set via $apis.set, then commits with "unlike"', () => {
        store.actions.$apis.set.modifyItems = sinon.stub().resolves({});
        const state = { likesId: setId };

        store.actions.unlike({ dispatch, commit, state }, itemId);

        expect(store.actions.$apis.set.modifyItems.calledWith('delete', state.likesId, itemId)).toBe(true);
        expect(commit.calledWith('unlike', itemId)).toBe(true);
      });
    });

    describe('addItem()', () => {
      it('adds to set via $apis.set, then dispatches "refreshCreation"', async() => {
        store.actions.$apis.set.modifyItems = sinon.stub().resolves({});
        const state = {};

        await store.actions.addItem({ dispatch, state }, { setId, itemId });

        expect(store.actions.$apis.set.modifyItems.calledWith('add', setId, itemId)).toBe(true);
        expect(dispatch.calledWith('refreshCreation', setId)).toBe(true);
      });
    });

    describe('removeItem()', () => {
      it('removes from set via $apis.set, then dispatches "refreshCreation"', async() => {
        store.actions.$apis.set.modifyItems = sinon.stub().resolves({});
        const state = {};

        await store.actions.removeItem({ dispatch, state }, { setId, itemId });

        expect(store.actions.$apis.set.modifyItems.calledWith('delete', setId, itemId)).toBe(true);
        expect(dispatch.calledWith('refreshCreation', setId)).toBe(true);
      });
    });

    // TODO: rename to indicate setting of ID only?
    describe('setLikes()', () => {
      it('gets likes set via $apis.set, then commits ID with "setLikesId"', async() => {
        store.actions.$auth.user = { sub: userId };
        store.actions.$apis.set.getLikes = sinon.stub().resolves(setId);

        await store.actions.setLikes({ commit });

        expect(store.actions.$apis.set.getLikes.calledWith(userId)).toBe(true);
        expect(commit.calledWith('setLikesId', setId)).toBe(true);
      });
    });

    describe('createLikes()', () => {
      it('creates likes set via $apis.set, then commits ID with "setLikesId"', async() => {
        store.actions.$apis.set.createLikes = sinon.stub().resolves({ id: setId });

        await store.actions.createLikes({ commit });

        expect(store.actions.$apis.set.createLikes.calledWith()).toBe(true);
        expect(commit.calledWith('setLikesId', setId)).toBe(true);
      });
    });

    describe('fetchLikes()', () => {
      describe('without likesId in state', () => {
        it('does not fetch likes via $apis.set', async() => {
          store.actions.$apis.set.get = sinon.stub().resolves(set);
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
      it('fetches the active set with itemDescriptions via $apis.set, then commits it with "setActive"', async() => {
        store.actions.$apis.set.get = sinon.stub().resolves(set);

        await store.actions.fetchActive({ commit }, setId);

        expect(store.actions.$apis.set.get.calledWith(setId, {
          profile: 'itemDescriptions'
        })).toBe(true);
        expect(commit.calledWith('setActive', set)).toBe(true);
      });
    });

    describe('createSet()', () => {
      it('create the set via $apis.set, then dispatches "fetchCreations"', async() => {
        store.actions.$apis.set.create = sinon.stub().resolves();
        const body = {};

        await store.actions.createSet({ dispatch }, body);

        expect(store.actions.$apis.set.create.calledWith(body)).toBe(true);
        expect(dispatch.calledWith('fetchCreations')).toBe(true);
      });
    });

    describe('update()', () => {
      it('updates the set via $apis.set', async() => {
        store.actions.$apis.set.update = sinon.stub().resolves({});
        const body = {};
        const state = {};

        await store.actions.update({ commit, state }, { id: setId, body });

        expect(store.actions.$apis.set.update.calledWith(setId, body)).toBe(true);
      });

      describe('when set is active', () => {
        it('commits with "setActive", preserving items', async() => {
          const activeWas = set;
          const activeUpdates = { title: { en: 'My set' } };
          const activeResponse = { id: setId, title: { en: 'My set' } };
          const activeWillBe = {
            id: setId,
            items: [],
            title: { en: 'My set' }
          };
          store.actions.$apis.set.update = sinon.stub().resolves(activeResponse);
          const state = { active: activeWas };

          await store.actions.update({ commit, state }, { id: setId, activeUpdates });

          expect(commit.calledWith('setActive', activeWillBe)).toBe(true);
        });
      });
    });

    describe('deleteSet()', () => {
      it('deletes the set via $apis.set', async() => {
        store.actions.$apis.set.deleteSet = sinon.stub().resolves();
        const state = {};

        await store.actions.deleteSet({ commit, state }, setId);

        expect(store.actions.$apis.set.deleteSet.calledWith(setId)).toBe(true);
      });

      describe('when set was active', () => {
        it('commits `DELETED` with "setActive"', async() => {
          store.actions.$apis.set.deleteSet = sinon.stub().resolves();
          const state = { active: { id: setId } };

          await store.actions.deleteSet({ commit, state }, setId);

          expect(commit.calledWith('setActive', 'DELETED')).toBe(true);
        });
      });
    });

    describe('refreshCreation', () => {
      describe('when creation is not stored', () => {
        it('does not fetch it via $apis.set', async() => {
          store.actions.$apis.set.get = sinon.stub().resolves();
          const state = { creations: [] };

          await store.actions.refreshCreation({ commit, state }, setId);

          expect(store.actions.$apis.set.get.called).toBe(false);
        });
      });

      describe('when creation is stored', () => {
        it('fetches it via $apis.set, then commits with "setCreations"', async() => {
          const oldCreation = { id: setId, title: { en: 'Old title' } };
          const newCreation = { id: setId, title: { en: 'New title' } };
          const state = { creations: [oldCreation] };
          store.actions.$apis.set.get = sinon.stub().resolves(newCreation);

          await store.actions.refreshCreation({ commit, state, dispatch }, setId);

          expect(store.actions.$apis.set.get.calledWith(setId, {
            profile: 'standard'
          })).toBe(true);
          expect(commit.calledWith('setCreations', [newCreation])).toBe(true);
        });
      });
    });

    describe('fetchCreations()', () => {
      it('fetches creations via $apis.set', async() => {
        const searchResponse = { data: { items: ['1', '2'] } };
        store.actions.$auth.user = { sub: userId };
        store.actions.$apis.set.search = sinon.stub().resolves(searchResponse);

        await store.actions.fetchCreations({ commit, dispatch });

        expect(store.actions.$apis.set.search.calledWith({
          query: `creator:${userId}`,
          profile: 'standard',
          pageSize: 100,
          qf: 'type:Collection'
        })).toBe(true);
      });

      it('commits creations with "setCreations"', async() => {
        const searchResponse = { data: { items: ['1', '2'] } };
        store.actions.$auth.user = { sub: userId };
        store.actions.$apis.set.search = sinon.stub().resolves(searchResponse);

        await store.actions.fetchCreations({ commit, dispatch });

        expect(commit.calledWith('setCreations', ['1', '2'])).toBe(true);
      });

      it('triggers fetching of creation previews', async() => {
        const searchResponse = { data: { items: ['1', '2'] } };
        store.actions.$auth.user = { sub: userId };
        store.actions.$apis.set.search = sinon.stub().resolves(searchResponse);

        await store.actions.fetchCreations({ commit, dispatch });

        expect(dispatch.calledWith('fetchCreationPreviews')).toBe(true);
      });
    });

    describe('fetchCreationPreviews()', () => {
      const state = { creations: [{ id: '01', items: [
        'http://data.europeana.eu/item/111',
        'http://data.europeana.eu/item/112'
      ] },
      { id: '02', items: [
        'http://data.europeana.eu/item/222',
        'http://data.europeana.eu/item/223'
      ] }] };
      const searchResponse = { items: [{ id: '/111',
        edmPreview: ['http://www.example.eu/img/111'] }, { id: '/222',
        edmPreview: ['http://www.example.eu/img/222'] }] };

      it('fetches first items for each creation via $apis.record', async() => {
        store.actions.$apis.record.search = sinon.stub().resolves(searchResponse);

        await store.actions.fetchCreationPreviews({ state, commit });

        expect(store.actions.$apis.record.search.calledWith({
          query: 'europeana_id:("/111" OR "/222")',
          qf: ['contentTier:*'],
          profile: 'minimal'
        })).toBe(true);
      });

      it('commits edm:preview of items with "setCreationPreviews"', async() => {
        store.actions.$apis.record.search = sinon.stub().resolves(searchResponse);

        await store.actions.fetchCreationPreviews({ state, commit });

        expect(commit.calledWith('setCreationPreviews', { '01': 'http://www.example.eu/img/111', '02': 'http://www.example.eu/img/222' })).toBe(true);
      });
    });

    describe('fetchCurations()', () => {
      it('fetches entity related galleries the user has curated via $apis.set, then commits with "setCurations"', async() => {
        const searchResponse = { data: { items: ['1', '2'] } };
        store.actions.$auth.user = { sub: userId };
        store.actions.$apis.set.search = sinon.stub().resolves(searchResponse);

        await store.actions.fetchCurations({ commit });

        expect(store.actions.$apis.set.search.calledWith({
          query: `contributor:${userId}`,
          profile: 'itemDescriptions',
          pageSize: 100,
          qf: 'type:EntityBestItemsSet'
        })).toBe(true);
        expect(commit.calledWith('setCurations', ['1', '2'])).toBe(true);
      });
    });

    describe('refreshSet()', () => {
      describe('when collection-modal hides', () => {
        it('refreshes the updated active set by dispatching "fetchActive" with the current active setId', async() => {
          const state = { active: set };

          await store.actions.refreshSet({ state, dispatch });

          expect(dispatch.calledWith('fetchActive')).toBe(true);
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
  });
});
