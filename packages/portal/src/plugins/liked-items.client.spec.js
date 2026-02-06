import sinon from 'sinon';
import { nextTick } from 'vue';
import likedItemsClientPlugin from './liked-items.client.js';

const itemIds = ['/123/abc', '/123/def'];
const moreItemIds = ['/123/ghi'];
const likedItemsSetId = '123';
const setApiDeleteItemsStub = sinon.stub();
const setApiInsertItemsStub = sinon.stub();
const setApiSearchItemsStub = sinon.stub().resolves({
  items: ['http://data.europeana.eu/item/123/abc']
});

const $apis = {
  set: {
    deleteItems: setApiDeleteItemsStub,
    insertItems: setApiInsertItemsStub,
    searchItems: setApiSearchItemsStub
  }
};
const store = {
  state: {
    set: {
      likesId: likedItemsSetId
    }
  }
};

const factory = (context = { $apis, store }) => {
  let injected;
  const inject = (name, injection) => {
    injected = injection;
  };

  likedItemsClientPlugin(context, inject);

  return injected;
};

describe('liked-items.client plugin', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.reset);

  it('is injected into context as likedItems', () => {
    const inject = sinon.spy();

    likedItemsClientPlugin({}, inject);

    expect(inject.calledWith('likedItems', sinon.match.object)).toBe(true);
  });

  describe('watchItems', () => {
    it('queries Set API for liked items', async() => {
      const { watchItems } = factory();

      watchItems(itemIds);
      await nextTick();

      expect(setApiSearchItemsStub.calledWith(likedItemsSetId, itemIds)).toBe(true);
    });

    it('combines into one Set API query multiple sets of watched items', async() => {
      const { watchItems } = factory();

      watchItems(itemIds);
      watchItems(moreItemIds);
      await nextTick();

      expect(setApiSearchItemsStub.calledWith(likedItemsSetId, itemIds.concat(moreItemIds))).toBe(true);
    });

    it('stores the response in liked ref', async() => {
      const { liked, watchItems } = factory();

      watchItems(itemIds);
      await nextTick(); // for the fetch
      await nextTick(); // for updating the computed liked

      expect(liked.value).toEqual(['http://data.europeana.eu/item/123/abc']);
    });
  });

  describe('like', () => {
    it('adds the items to the Set API likes set', () => {
      const { like } = factory();

      like(itemIds);

      expect(setApiInsertItemsStub.calledWith(likedItemsSetId, itemIds)).toBe(true);
    });

    it('queries Set API for liked items', async() => {
      const { like, watchItems } = factory();

      watchItems(itemIds);
      await like(moreItemIds);
      await nextTick();

      expect(setApiSearchItemsStub.calledWith(likedItemsSetId, itemIds)).toBe(true);
    });

    it('dispatches "like" event to listeners', async() => {
      const { like, on } = factory();
      const onLikeListener = sinon.spy();

      on('like', onLikeListener);
      like(itemIds);
      await nextTick();

      expect(onLikeListener.calledWith()).toBe(true);
    });
  });

  describe('unlike', () => {
    it('removes the items from the Set API likes set', () => {
      const { unlike } = factory();

      unlike(itemIds);

      expect(setApiDeleteItemsStub.calledWith(likedItemsSetId, itemIds)).toBe(true);
    });

    it('queries Set API for liked items', async() => {
      const { unlike, watchItems } = factory();

      watchItems(itemIds);
      await unlike(moreItemIds);
      await nextTick();

      expect(setApiSearchItemsStub.calledWith(likedItemsSetId, itemIds)).toBe(true);
    });

    it('dispatches "unlike" event to listeners', async() => {
      const { on, unlike } = factory();
      const onUnlikeListener = sinon.spy();

      on('unlike', onUnlikeListener);
      unlike(itemIds);
      await nextTick();

      expect(onUnlikeListener.calledWith()).toBe(true);
    });
  });
});
