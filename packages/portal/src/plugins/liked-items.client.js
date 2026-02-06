import { computed, nextTick, readonly, ref } from 'vue';
import uniq from 'lodash/uniq';

export default ({ $apis, store }, inject) => {
  const setId = computed(() => store.state.set.likesId);
  const watchedItemIds = ref([]);
  const liked = ref([]);
  const eventTarget = new EventTarget();

  // TODO: is this needed?
  let fetching;

  const fetchLikedItems = async() => {
    if (fetching) {
      return;
    }
    fetching = true;
    if ($apis.set && setId.value && watchedItemIds.value.length) {
      // QUESTION: what is the limit to how many item ids this can handle?
      const response = await $apis.set.searchItems(setId.value, uniq(watchedItemIds.value.flat()));
      liked.value = response.items || [];
    }
    fetching = false;
  };

  const watchItems = async(itemIds) => {
    watchedItemIds.value.push(itemIds);
    await nextTick();
    await fetchLikedItems();
  };

  const unwatchItems = (itemIds) => {
    watchedItemIds.value.splice(watchedItemIds.value.indexOf(itemIds), 1);
  };

  const like = async(itemIds) => {
    if (setId === null) {
      const response = await $apis.set.createLikes();
      // TODO: does likesId still need to be in the store? or just isolate it to this plugin?
      //       yes, for now, as still used by UserLikes
      store.commit('set/setLikesId', response.id);
    }

    await $apis.set.insertItems(setId.value, itemIds);
    await fetchLikedItems();

    eventTarget.dispatchEvent(new Event('like'));
  };

  const unlike = async(itemIds) => {
    await $apis.set.deleteItems(setId.value, itemIds);

    await fetchLikedItems();

    eventTarget.dispatchEvent(new Event('unlike'));
  };

  const on = (type, listener, options) => {
    eventTarget.addEventListener(type, listener, options);
  };

  const off = (type, listener, options) => {
    eventTarget.removeEventListener(type, listener, options);
  };

  inject('likedItems', {
    liked: readonly(liked),
    like,
    off,
    on,
    watchItems,
    unlike,
    unwatchItems
  });
};
