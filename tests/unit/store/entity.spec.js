import store from '@/store/entity';
import sinon from 'sinon';

describe('store/entity', () => {
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
