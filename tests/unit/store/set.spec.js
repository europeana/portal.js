import * as store from '../../../store/set';
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
    const dispatch = sinon.spy();
    const setId = 'http://data.europeana.eu/set/123';
    const itemId = '/123/ghi';
    const userId = 'a-b-c-d-e';
    const set = {
      id: setId,
      items: []
    };

    beforeEach(() => {
      commit.resetHistory();
      dispatch.resetHistory();
      store.actions.$sets = {};
      store.actions.$auth = {};
    });

    describe('reset()', () => {
      const resetCommits = {
        setLikesId: null,
        setLikedItems: [],
        setCreations: []
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
      it('adds to likes set via $sets, then commits with "like"', () => {
        store.actions.$sets.modifyItems = sinon.stub().resolves({});
        const state = { likesId: setId };

        store.actions.like({ commit, state }, itemId);

        store.actions.$sets.modifyItems.should.have.been.calledWith('add', state.likesId, itemId);
        commit.should.have.been.calledWith('like', itemId);
      });
    });

    describe('unlike()', () => {
      it('removes from likes set via $sets, then commits with "unlike"', () => {
        store.actions.$sets.modifyItems = sinon.stub().resolves({});
        const state = { likesId: setId };

        store.actions.unlike({ commit, state }, itemId);

        store.actions.$sets.modifyItems.should.have.been.calledWith('delete', state.likesId, itemId);
        commit.should.have.been.calledWith('unlike', itemId);
      });
    });

    describe('addItem()', () => {
      it('adds to set via $sets, then dispatches "refreshCreation"', async() => {
        store.actions.$sets.modifyItems = sinon.stub().resolves({});
        const state = {};

        await store.actions.addItem({ dispatch, state }, { setId, itemId });

        store.actions.$sets.modifyItems.should.have.been.calledWith('add', setId, itemId);
        dispatch.should.have.been.calledWith('refreshCreation', setId);
      });

      context('when set is active', () => {
        it('dispatches "fetchActive"', async() => {
          store.actions.$sets.modifyItems = sinon.stub().resolves({});
          const state = { active: { id: setId } };

          await store.actions.addItem({ dispatch, state }, { setId, itemId });

          dispatch.should.have.been.calledWith('fetchActive', setId);
        });
      });
    });

    describe('removeItem()', () => {
      it('removes from set via $sets, then dispatches "refreshCreation"', async() => {
        store.actions.$sets.modifyItems = sinon.stub().resolves({});
        const state = {};

        await store.actions.removeItem({ dispatch, state }, { setId, itemId });

        store.actions.$sets.modifyItems.should.have.been.calledWith('delete', setId, itemId);
        dispatch.should.have.been.calledWith('refreshCreation', setId);
      });

      context('when set is active', () => {
        it('dispatches "fetchActive"', async() => {
          store.actions.$sets.modifyItems = sinon.stub().resolves({});
          const state = { active: { id: setId } };

          await store.actions.removeItem({ dispatch, state }, { setId, itemId });

          dispatch.should.have.been.calledWith('fetchActive', setId);
        });
      });
    });

    // TODO: rename to indicate setting of ID only?
    describe('setLikes()', () => {
      it('gets likes set via $sets, then commits ID with "setLikesId"', async() => {
        store.actions.$auth.user = { sub: userId };
        store.actions.$sets.getLikes = sinon.stub().resolves(setId);

        await store.actions.setLikes({ commit });

        store.actions.$sets.getLikes.should.have.been.calledWith(userId);
        commit.should.have.been.calledWith('setLikesId', setId);
      });
    });

    describe('createLikes()', () => {
      it('creates likes set via $sets, then commits ID with "setLikesId"', async() => {
        store.actions.$sets.createLikes = sinon.stub().resolves({ id: setId });

        await store.actions.createLikes({ commit });

        store.actions.$sets.createLikes.should.have.been.calledWith();
        commit.should.have.been.calledWith('setLikesId', setId);
      });
    });

    describe('fetchLikes()', () => {
      context('without likesId in state', () => {
        it('does not fetch likes via $sets', async() => {
          store.actions.$sets.getSet = sinon.stub().resolves(set);
          const state = {};

          await store.actions.fetchLikes({ state, commit });

          store.actions.$sets.getSet.should.not.have.been.called;
        });
      });

      context('with likesId in state', () => {
        it('fetches likes via $sets, then commits the items with "setLikedItems"', async() => {
          store.actions.$sets.getSet = sinon.stub().resolves(set);
          const state = { likesId: setId };

          await store.actions.fetchLikes({ state, commit });

          store.actions.$sets.getSet.should.have.been.calledWith(setId, sinon.match.any);
          commit.should.have.been.calledWith('setLikedItems', set.items);
        });
      });
    });

    describe('fetchActive()', () => {
      it('fetches the active set with itemDescriptions via $sets, then commits it with "setActive"', async() => {
        store.actions.$sets.getSet = sinon.stub().resolves(set);

        await store.actions.fetchActive({ commit }, setId);

        store.actions.$sets.getSet.should.have.been.calledWith(setId, {
          profile: 'itemDescriptions'
        });
        commit.should.have.been.calledWith('setActive', set);
      });
    });

    describe('createSet()', () => {
      it('create the set via $sets, then dispatches "fetchCreations"', async() => {
        store.actions.$sets.createSet = sinon.stub().resolves();
        const body = {};

        await store.actions.createSet({ dispatch }, body);

        store.actions.$sets.createSet.should.have.been.calledWith(body);
        dispatch.should.have.been.calledWith('fetchCreations');
      });
    });

    describe('updateSet()', () => {
      it('updates the set via $sets', async() => {
        store.actions.$sets.updateSet = sinon.stub().resolves({});
        const body = {};
        const state = {};

        await store.actions.updateSet({ commit, state }, { id: setId, body });

        store.actions.$sets.updateSet.should.have.been.calledWith(setId, body);
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
          store.actions.$sets.updateSet = sinon.stub().resolves(activeResponse);
          const state = { active: activeWas };

          await store.actions.updateSet({ commit, state }, { id: setId, activeUpdates });

          commit.should.have.been.calledWith('setActive', activeWillBe);
        });
      });
    });

    describe('deleteSet()', () => {
      it('deletes the set via $sets', async() => {
        store.actions.$sets.deleteSet = sinon.stub().resolves();
        const state = {};

        await store.actions.deleteSet({ commit, state }, setId);

        store.actions.$sets.deleteSet.should.have.been.calledWith(setId);
      });

      context('when set was active', () => {
        it('commits `null` with "setActive"', async() => {
          store.actions.$sets.deleteSet = sinon.stub().resolves();
          const state = { active: { id: setId } };

          await store.actions.deleteSet({ commit, state }, setId);

          commit.should.have.been.calledWith('setActive', null);
        });
      });
    });

    describe('refreshCreation', () => {
      context('when creation is not stored', () => {
        it('does not fetch it via $sets', async() => {
          store.actions.$sets.getSet = sinon.stub().resolves();
          const state = { creations: [] };

          await store.actions.refreshCreation({ commit, state }, setId);

          store.actions.$sets.getSet.should.not.have.been.called;
        });
      });

      context('when creation is not stored', () => {
        it('fetches it via $sets with itemDescriptions, then commits with "setCreations"', async() => {
          const oldCreation = { id: setId, title: { en: 'Old title' } };
          const newCreation = { id: setId, title: { en: 'New title' } };
          const state = { creations: [oldCreation] };
          store.actions.$sets.getSet = sinon.stub().resolves(newCreation);

          await store.actions.refreshCreation({ commit, state }, setId);

          store.actions.$sets.getSet.should.have.been.calledWith(setId, {
            profile: 'itemDescriptions'
          });
          commit.should.have.been.calledWith('setCreations', [newCreation]);
        });
      });
    });

    describe('fetchCreations()', () => {
      it('fetches creations via $sets, then commits with "setCreations"', async() => {
        const searchResponse = { data: { items: ['1', '2'] } };
        store.actions.$auth.user = { sub: userId };
        store.actions.$sets.search = sinon.stub().resolves(searchResponse);

        await store.actions.fetchCreations({ commit });

        store.actions.$sets.search.should.have.been.calledWith({
          query: `creator:${userId}`,
          profile: 'itemDescriptions',
          pageSize: 100
        });
        commit.should.have.been.calledWith('setCreations', ['1', '2']);
      });
    });
  });
});
