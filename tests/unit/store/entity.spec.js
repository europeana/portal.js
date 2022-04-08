import store from '@/store/entity';
import sinon from 'sinon';

const entity = { id: 'http://data.europeana.eu/concept/base/001' };
const id = 'http://data.europeana.eu/concept/base/001';
const page = { name: 'Art' };
const relatedEntities = [{ id: 'http://data.europeana.eu/concept/base/002' }, { id: 'http://data.europeana.eu/concept/base/003' }];
const itemsToPin = [{ id: '/123/abc' }, { id: '/234/abc' }];
const pinned = ['/123/abc', '/234/abc'];
const unPinned = ['/234/abc'];
const curatedEntity1 = { id: '100', identifier: 'http://data.europeana.eu/concept/base/100' };
const curatedEntity2 = { id: '200', identifier: 'http://data.europeana.eu/concept/base/200'  };
const curatedEntities = [curatedEntity1, curatedEntity2];
const itemId = '/123/abc';
const itemIdNotPinned = '/345/abc';
const entityDescription = { en: 'example entity description' };
const enPrefLabel = 'Art';
const exampleState = {
  id: 'http://data.europeana.eu/concept/base/001',
  entity: {
    prefLabel: { en: enPrefLabel }
  }
};
const featuredSet = { pinned: 2, items: itemsToPin };

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
    describe('setPage()', () => {
      it('sets the page state', () => {
        const state = { page: null };
        store.mutations.setPage(state, page);
        expect(state.page).toEqual(page);
      });
    });
    describe('setRelatedEntities()', () => {
      it('sets the relatedEntities state', () => {
        const state = { relatedEntities: null };
        store.mutations.setRelatedEntities(state, relatedEntities);
        expect(state.relatedEntities).toEqual(relatedEntities);
      });
    });
    describe('setCuratedEntities()', () => {
      it('sets the curatedEntities state', () => {
        const state = { curatedEntities: null };
        store.mutations.setCuratedEntities(state, curatedEntities);
        expect(state.curatedEntities).toEqual(curatedEntities);
      });
    });
    describe('setPinned()', () => {
      describe('when value passed in', () => {
        it('sets the pinned state', () => {
          const state = { pinned: null };
          store.mutations.setPinned(state, itemsToPin);
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
    describe('setFeaturedSetId()', () => {
      it('sets the featuredSetId state', () => {
        const state = { featuredSetId: null };
        store.mutations.setFeaturedSetId(state, curatedEntity1.id);
        expect(state.featuredSetId).toEqual(curatedEntity1.id);
      });
    });
    describe('pin()', () => {
      it('adds the item id to the pinned state', () => {
        const state = { pinned: [] };
        store.mutations.pin(state, itemId);
        expect(state.pinned).toEqual([itemId]);
      });
    });
    describe('unpin()', () => {
      it('removes the item id from the pinned state', () => {
        const state = { pinned: [...pinned] };
        store.mutations.unpin(state, itemId);
        expect(state.pinned).toEqual(unPinned);
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
    describe('setProxy()', () => {
      it('sets the entity proxy state', () => {
        const state = { entity: {} };
        store.mutations.setProxy(state, { id: 'proxy001' });
        expect(state.entity.proxy).toEqual({ id: 'proxy001' });
      });
    });
    describe('setProxyDescription()', () => {
      it('sets the entity proxy note state', () => {
        const state = { entity: { proxy: {} } };
        store.mutations.setProxyDescription(state, 'example entity description');
        expect(state.entity.proxy.note).toEqual('example entity description');
      });
    });
  });

  describe('getters', () => {
    describe('englishPrefLabel()', () => {
      describe('when the entity state has an id, entity and entity English prefLabel defined', () => {
        it('returns the entity\'s English prefLabel', () => {
          const state = exampleState;

          const englishPrefLabel = store.getters.englishPrefLabel(state);

          expect(englishPrefLabel).toEqual(enPrefLabel);
        });
      });
      describe('when the entity state has not an id, entity or entity English prefLabel defined', () => {
        it('returns null', () => {
          const state = {};

          const englishPrefLabel = store.getters.englishPrefLabel(state);

          expect(englishPrefLabel).toEqual(null);
        });
      });
    });
    describe('curatedEntity()', () => {
      it('returns the entity if it is a curated entity', () => {
        const state = { curatedEntities };

        const curatedEntity = store.getters.curatedEntity(state)(curatedEntity1.identifier);

        expect(curatedEntity).toEqual(curatedEntity1);
      });
    });
    describe('id()', () => {
      describe('when the id state is set', () => {
        it('returns the id', () => {
          const state = { id };

          const getId = store.getters.id(state);

          expect(getId).toEqual(id);
        });
      });
      describe('when the id state is not set', () => {
        it('returns null', () => {
          const state = {};

          const getId = store.getters.id(state);

          expect(getId).toEqual(null);
        });
      });
    });
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

  describe('actions', () => {
    const commit = sinon.spy();
    const dispatch = sinon.stub().resolves({});
    const featuredSetId = 'http://data.europeana.eu/set/123';
    const itemId = '/123/ghi';

    beforeEach(() => {
      dispatch.resetHistory();
      store.actions.$apis = { set: {}, entityManagement: {} };
    });

    describe('getFeatured()', () => {
      it('sets the featuredSetId and gets the pins', async() => {
        const searchResponse = { data: { total: 1, items: curatedEntities.map(set => set.identifier) } };
        store.actions.$apis.set.search = sinon.stub().resolves(searchResponse);
        const state = { id };

        await store.actions.getFeatured({ commit, state, dispatch });

        expect(commit.calledWith('setFeaturedSetId', searchResponse.data.items[0].split('/').pop())).toBe(true);
        expect(dispatch.calledWith('getPins')).toBe(true);
      });
    });
    describe('pin()', () => {
      describe('when amount of pin limit is reached', () => {
        it('throws an error', async() => {
          const pinnedItems = Array.from(Array(24).keys()).map(item => {
            return { id: `${item}` };
          });
          const state = { pinned: pinnedItems };

          await expect(store.actions.pin({ dispatch, state, commit }, itemId)).rejects.toThrowError();
          await expect(store.actions.pin({ dispatch, state, commit }, itemId)).rejects.toEqual(new Error('too many pins'));
        });
      });
      it('pins the item to the entity set via $api.set', async() => {
        store.actions.$apis.set.modifyItems = sinon.stub().resolves({});
        const state = { featuredSetId };

        await store.actions.pin({ dispatch, state, commit }, itemId);

        expect(store.actions.$apis.set.modifyItems.calledWith('add', featuredSetId, itemId)).toBe(true);
        expect(commit.calledWith('pin', itemId)).toBe(true);
      });
    });
    describe('unpin()', () => {
      it('unpins the item from the entity set via $api.set and refetches the set and pins', async() => {
        store.actions.$apis.set.modifyItems = sinon.stub().resolves({});
        const state = { featuredSetId };

        await store.actions.unpin({ dispatch, state }, itemId);

        expect(store.actions.$apis.set.modifyItems.calledWith('delete', featuredSetId, itemId)).toBe(true);
        expect(dispatch.calledWith('set/fetchActive', state.featuredSetId, { root: true })).toBe(true);
        expect(dispatch.calledWith('getPins')).toBe(true);
      });
      // describe('when api call errors', () => {
      //   it('throws an error and gets pins', async() => {
      //     store.actions.$apis.set.modifyItems = sinon.stub().rejects({});
      //     const state = { featuredSetId };

      //     await expect(store.actions.unpin({ dispatch, state }, itemId)).rejects.toThrowError();
      //     expect(dispatch.calledWith('getPins')).toBe(true);
      //   });
      // });
    });
    describe('getPins()', () => {
      it('gets the featured set and sets the pins', async() => {
        store.actions.$apis.set.get = sinon.stub().resolves(featuredSet);
        const state = {};

        await store.actions.getPins({ state, commit });

        expect(commit.calledWith('setPinned', itemsToPin)).toBe(true);
      });
      describe('when no pinned items', () => {
        it('gets the featured set and sets the pinned state to empty array', async() => {
          store.actions.$apis.set.get = sinon.stub().resolves({ ...featuredSet.pinned = 0 });
          const state = {};

          await store.actions.getPins({ state, commit });

          expect(commit.calledWith('setPinned', [])).toBe(true);
        });
      });
    });
    describe('createFeaturedSet()', () => {
      it('creates a new featured set and commits setFeaturedSetId', async() => {
        const newSet = { id: 'newset001' };
        const getters = { id, englishPrefLabel: enPrefLabel };
        store.actions.$apis.set.create = sinon.stub().resolves(newSet);

        await store.actions.createFeaturedSet({ getters, commit });

        expect(commit.calledWith('setFeaturedSetId', newSet.id)).toBe(true);
      });
    });
    describe('update()', () => {
      it('updates the entity description', async() => {
        const body = { note: 'This is an updated enitty description' };

        store.actions.$apis.entityManagement.update = sinon.stub().resolves(body);

        await store.actions.update({ commit }, { id, body });

        expect(commit.calledWith('setProxyDescription', body.note)).toBe(true);
        expect(commit.calledWith('setEntityDescription', body.note)).toBe(true);
      });
    });
  });
});
