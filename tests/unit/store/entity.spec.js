import store from '@/store/entity';
import sinon from 'sinon';

const curatedEntities = [{ id: 'http://data.europeana.eu/concept/base/100' }, { id: 'http://data.europeana.eu/concept/base/200' }];
const entity = { id: 'http://data.europeana.eu/concept/base/001' };
const id = 'http://data.europeana.eu/concept/base/001';
const page = { name: 'Art' };
// recordsPerPage: 24,
const relatedEntities = [{ id: 'http://data.europeana.eu/concept/base/002' }, { id: 'http://data.europeana.eu/concept/base/003' }];
const itemsToPin = [{ id: '/123/abc' }, { id: '/234/abc' }];
const pinned = ['/123/abc', '/234/abc'];
const unPinned = ['/234/abc'];
const featuredSetId = 'http://data.europeana.eu/concept/base/100';
// editable: false
const itemId = '/123/abc';
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
        store.mutations.setFeaturedSetId(state, featuredSetId);
        expect(state.featuredSetId).toEqual(featuredSetId);
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

  describe('actions', () => {
    const dispatch = sinon.stub().resolves({});
    const featuredSetId = 'http://data.europeana.eu/set/123';
    const itemId = '/123/ghi';

    beforeEach(() => {
      dispatch.resetHistory();
      store.actions.$apis = { set: {} };
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
    });
  });
});
