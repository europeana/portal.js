import { nextTick, readonly, ref } from 'vue';
import uniq from 'lodash/uniq';

export default async({ $apis, $auth }, inject) => {
  let likedItemsSetId = null;

  if ($auth?.loggedIn && $auth?.user?.sub) {
    try {
      likedItemsSetId = await $apis.set.getLikes($auth.user.sub);
    } catch (e) {
      // Don't cause everything to break if the Set API is down...
    }
  }

  const watchedItemIds = ref([]);
  const liked = ref([]);
  const eventTarget = new EventTarget();

  // TODO: is this needed?
  let fetching;

  const fetchLikedItems = (params = {}) => {
    return likedItemsSetId ? $apis.set.get(likedItemsSetId, params) : {};
  };

  const findLikedWatchedItems = async() => {
    if (fetching) {
      return;
    }
    fetching = true;
    if ($apis.set && likedItemsSetId && watchedItemIds.value.length) {
      // QUESTION: what is the limit to how many item ids this can handle?
      const response = await $apis.set.searchItems(likedItemsSetId, uniq(watchedItemIds.value.flat()));
      liked.value = response.items || [];
    }
    fetching = false;
  };

  const watchItems = async(itemIds) => {
    watchedItemIds.value.push(itemIds);
    await nextTick();
    await findLikedWatchedItems();
  };

  const unwatchItems = (itemIds) => {
    watchedItemIds.value.splice(watchedItemIds.value.indexOf(itemIds), 1);
  };

  const like = async(itemIds) => {
    if (likedItemsSetId === null) {
      const response = await $apis.set.createLikes();
      likedItemsSetId = response.id;
    }

    await $apis.set.insertItems(likedItemsSetId, itemIds);
    await findLikedWatchedItems();

    eventTarget.dispatchEvent(new Event('like'));
  };

  const unlike = async(itemIds) => {
    await $apis.set.deleteItems(likedItemsSetId, itemIds);

    await findLikedWatchedItems();

    eventTarget.dispatchEvent(new Event('unlike'));
  };

  const on = (type, listener, options) => {
    eventTarget.addEventListener(type, listener, options);
  };

  const off = (type, listener, options) => {
    eventTarget.removeEventListener(type, listener, options);
  };

  inject('likedItems', {
    fetch: fetchLikedItems,
    liked: readonly(liked),
    like,
    off,
    on,
    watchItems,
    unlike,
    unwatchItems
  });
};
