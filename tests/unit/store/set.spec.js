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

        isLiked.should.be.true;
      });

      it('is `false` if likedItemIds state does not include item ID', () => {
        const itemId = '/123/ghi';
        const state = {
          likedItemIds: ['/123/abc', '/123/def']
        };

        const isLiked = store.getters.isLiked(state)(itemId);

        isLiked.should.be.false;
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

          commit.should.have.been.calledWith(commitName, commitValue);
        });
      }
    });

    describe('like()', () => {
      it('adds to likes set via $apis.set, then commits with "like"', async() => {
        store.actions.$apis.set.modifyItems = sinon.stub().resolves({});
        const state = { likesId: setId };

        await store.actions.like({ dispatch, commit, state }, itemId);

        store.actions.$apis.set.modifyItems.should.have.been.calledWith('add', state.likesId, itemId);
        commit.should.have.been.calledWith('like', itemId);
      });
    });

    describe('unlike()', () => {
      it('removes from likes set via $apis.set, then commits with "unlike"', () => {
        store.actions.$apis.set.modifyItems = sinon.stub().resolves({});
        const state = { likesId: setId };

        store.actions.unlike({ dispatch, commit, state }, itemId);

        store.actions.$apis.set.modifyItems.should.have.been.calledWith('delete', state.likesId, itemId);
        commit.should.have.been.calledWith('unlike', itemId);
      });
    });

    describe('addItem()', () => {
      it('adds to set via $apis.set, then dispatches "refreshCreation"', async() => {
        store.actions.$apis.set.modifyItems = sinon.stub().resolves({});
        const state = {};

        await store.actions.addItem({ dispatch, state }, { setId, itemId });

        store.actions.$apis.set.modifyItems.should.have.been.calledWith('add', setId, itemId);
        dispatch.should.have.been.calledWith('refreshCreation', setId);
      });
    });

    describe('removeItem()', () => {
      it('removes from set via $apis.set, then dispatches "refreshCreation"', async() => {
        store.actions.$apis.set.modifyItems = sinon.stub().resolves({});
        const state = {};

        await store.actions.removeItem({ dispatch, state }, { setId, itemId });

        store.actions.$apis.set.modifyItems.should.have.been.calledWith('delete', setId, itemId);
        dispatch.should.have.been.calledWith('refreshCreation', setId);
      });
    });

    // TODO: rename to indicate setting of ID only?
    describe('setLikes()', () => {
      it('gets likes set via $apis.set, then commits ID with "setLikesId"', async() => {
        store.actions.$auth.user = { sub: userId };
        store.actions.$apis.set.getLikes = sinon.stub().resolves(setId);

        await store.actions.setLikes({ commit });

        store.actions.$apis.set.getLikes.should.have.been.calledWith(userId);
        commit.should.have.been.calledWith('setLikesId', setId);
      });
    });

    describe('createLikes()', () => {
      it('creates likes set via $apis.set, then commits ID with "setLikesId"', async() => {
        store.actions.$apis.set.createLikes = sinon.stub().resolves({ id: setId });

        await store.actions.createLikes({ commit });

        store.actions.$apis.set.createLikes.should.have.been.calledWith();
        commit.should.have.been.calledWith('setLikesId', setId);
      });
    });

    describe('fetchLikes()', () => {
      context('without likesId in state', () => {
        it('does not fetch likes via $apis.set', async() => {
          store.actions.$apis.set.get = sinon.stub().resolves(set);
          const state = {};

          await store.actions.fetchLikes({ state, commit });

          store.actions.$apis.set.get.should.not.have.been.called;
        });
      });

      context('with likesId in state', () => {
        it('fetches likes via $apis.set, then commits the items with "setLikedItems"', async() => {
          store.actions.$apis.set.get = sinon.stub().resolves(set);
          const state = { likesId: setId };

          await store.actions.fetchLikes({ state, commit });

          store.actions.$apis.set.get.should.have.been.calledWith(setId, sinon.match.any);
          commit.should.have.been.calledWith('setLikedItems', set.items);
        });
      });
    });

    describe('fetchActive()', () => {
      it('fetches the active set with itemDescriptions via $apis.set, then commits it with "setActive"', async() => {
        store.actions.$apis.set.get = sinon.stub().resolves(set);

        await store.actions.fetchActive({ commit }, setId);

        store.actions.$apis.set.get.should.have.been.calledWith(setId, {
          profile: 'itemDescriptions'
        });
        commit.should.have.been.calledWith('setActive', set);
      });
    });

    describe('createSet()', () => {
      it('create the set via $apis.set, then dispatches "fetchCreations"', async() => {
        store.actions.$apis.set.create = sinon.stub().resolves();
        const body = {};

        await store.actions.createSet({ dispatch }, body);

        store.actions.$apis.set.create.should.have.been.calledWith(body);
        dispatch.should.have.been.calledWith('fetchCreations');
      });
    });

    describe('update()', () => {
      it('updates the set via $apis.set', async() => {
        store.actions.$apis.set.update = sinon.stub().resolves({});
        const body = {};
        const state = {};

        await store.actions.update({ commit, state }, { id: setId, body });

        store.actions.$apis.set.update.should.have.been.calledWith(setId, body);
      });

      context('when set is active', () => {
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

          commit.should.have.been.calledWith('setActive', activeWillBe);
        });
      });
    });

    describe('deleteSet()', () => {
      it('deletes the set via $apis.set', async() => {
        store.actions.$apis.set.deleteSet = sinon.stub().resolves();
        const state = {};

        await store.actions.deleteSet({ commit, state }, setId);

        store.actions.$apis.set.deleteSet.should.have.been.calledWith(setId);
      });

      context('when set was active', () => {
        it('commits `DELETED` with "setActive"', async() => {
          store.actions.$apis.set.deleteSet = sinon.stub().resolves();
          const state = { active: { id: setId } };

          await store.actions.deleteSet({ commit, state }, setId);

          commit.should.have.been.calledWith('setActive', 'DELETED');
        });
      });
    });

    describe('refreshCreation', () => {
      context('when creation is not stored', () => {
        it('does not fetch it via $apis.set', async() => {
          store.actions.$apis.set.get = sinon.stub().resolves();
          const state = { creations: [] };

          await store.actions.refreshCreation({ commit, state }, setId);

          store.actions.$apis.set.get.should.not.have.been.called;
        });
      });

      context('when creation is stored', () => {
        it('fetches it via $apis.set, then commits with "setCreations"', async() => {
          const oldCreation = { id: setId, title: { en: 'Old title' } };
          const newCreation = { id: setId, title: { en: 'New title' } };
          const state = { creations: [oldCreation] };
          store.actions.$apis.set.get = sinon.stub().resolves(newCreation);

          await store.actions.refreshCreation({ commit, state, dispatch }, setId);

          store.actions.$apis.set.get.should.have.been.calledWith(setId, {
            profile: 'standard'
          });
          commit.should.have.been.calledWith('setCreations', [newCreation]);
        });
      });
    });

    describe('fetchCreations()', () => {
      it('fetches creations via $apis.set', async() => {
        const searchResponse = { data: { items: ['1', '2'] } };
        store.actions.$auth.user = { sub: userId };
        store.actions.$apis.set.search = sinon.stub().resolves(searchResponse);

        await store.actions.fetchCreations({ commit, dispatch });

        store.actions.$apis.set.search.should.have.been.calledWith({
          query: `creator:${userId}`,
          profile: 'standard',
          pageSize: 100,
          qf: 'type:Collection'
        });
      });

      it('commits creations with "setCreations"', async() => {
        const searchResponse = { data: { items: ['1', '2'] } };
        store.actions.$auth.user = { sub: userId };
        store.actions.$apis.set.search = sinon.stub().resolves(searchResponse);

        await store.actions.fetchCreations({ commit, dispatch });

        commit.should.have.been.calledWith('setCreations', ['1', '2']);
      });

      it('triggers fetching of creation previews', async() => {
        const searchResponse = { data: { items: ['1', '2'] } };
        store.actions.$auth.user = { sub: userId };
        store.actions.$apis.set.search = sinon.stub().resolves(searchResponse);

        await store.actions.fetchCreations({ commit, dispatch });

        dispatch.should.have.been.calledWith('fetchCreationPreviews');
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

        store.actions.$apis.record.search.should.have.been.calledWith({
          query: 'europeana_id:("/111" OR "/222")',
          qf: ['contentTier:*'],
          profile: 'minimal'
        });
      });

      it('commits edm:preview of items with "setCreationPreviews"', async() => {
        store.actions.$apis.record.search = sinon.stub().resolves(searchResponse);

        await store.actions.fetchCreationPreviews({ state, commit });

        commit.should.have.been.calledWith('setCreationPreviews', { '01': 'http://www.example.eu/img/111', '02': 'http://www.example.eu/img/222' });
      });
    });

    describe('fetchCurations()', () => {
      it('fetches entity related galleries the user has curated via $apis.set, then commits with "setCurations"', async() => {
        const searchResponse = { data: { items: ['1', '2'] } };
        store.actions.$auth.user = { sub: userId };
        store.actions.$apis.set.search = sinon.stub().resolves(searchResponse);

        await store.actions.fetchCurations({ commit });

        store.actions.$apis.set.search.should.have.been.calledWith({
          query: `contributor:${userId}`,
          profile: 'itemDescriptions',
          pageSize: 100,
          qf: 'type:EntityBestItemsSet'
        });
        commit.should.have.been.calledWith('setCurations', ['1', '2']);
      });
    });

    describe('refreshSet()', () => {
      context('when collection-modal hides', () => {
        it('refreshes the updated active set by dispatching "fetchActive" with the current active setId', async() => {
          const state = { active: set };

          await store.actions.refreshSet({ state, dispatch });

          dispatch.should.have.been.calledWith('fetchActive');
        });
      });
    });

    describe('fetchActiveRecommendations()', () => {
      it('fetches the active set recommendations via $apis.recommendation, then commits it with "setActiveRecommendations"', async() => {
        store.actions.$apis.recommendation.recommend = sinon.stub().resolves(recommendations);

        await store.actions.fetchActiveRecommendations({ commit }, setId);

        store.actions.$apis.recommendation.recommend.should.have.been.calledWith('set', setId);
        commit.should.have.been.calledWith('setActiveRecommendations', recommendations.items);
      });
    });

    describe('acceptRecommendation()', () => {
      it('accepts a recommended item via $apis.recommendation, then commits the returned new item with "setActiveRecommendations"', async() => {
        const state = { activeRecommendations: recommendations.items };

        store.actions.$apis.recommendation.accept = sinon.stub().resolves(newRecommendation);

        await store.actions.reviewRecommendation({ state, commit }, { setId, itemIds: [itemId], action: 'accept' });

        store.actions.$apis.recommendation.accept.should.have.been.calledWith('set', setId, [itemId]);
        commit.should.have.been.calledWith('setActiveRecommendations', updatedRecommendations);
      });
    });

    describe('rejectRecommendation()', () => {
      it('rejects a recommended item via $apis.recommendation, then commits the returned new item with "setActiveRecommendations"', async() => {
        const state = { activeRecommendations: recommendations.items };

        store.actions.$apis.recommendation.reject = sinon.stub().resolves(newRecommendation);

        await store.actions.reviewRecommendation({ state, commit }, { setId, itemIds: [itemId], action: 'reject' });

        store.actions.$apis.recommendation.reject.should.have.been.calledWith('set', setId, [itemId]);
        commit.should.have.been.calledWith('setActiveRecommendations', updatedRecommendations);
      });
    });
  });
});
