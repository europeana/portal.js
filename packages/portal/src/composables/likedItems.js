import { computed, getCurrentInstance, reactive, readonly, watchEffect } from 'vue';

export function useLikedItems(itemIds = null) {
  // TODO: reactive or ref?
  const likedItems = reactive({});

  const $root = getCurrentInstance()?.proxy?.$root;
  const setAPI = $root?.$apis?.set;
  const setId = computed(() => $root?.$store?.state.set.likesId);

  const fetchLikedItems = async() => {
    console.log('fetchLikedItems', itemIds.value)
    if (setAPI && setId.value && itemIds.value) {
      // TODO: pagination!
      const response = await setAPI.searchItems(setId.value, itemIds.value);
      for (const itemId of [].concat(itemIds.value)) {
        likedItems[itemId] = (response.items || []).some((item) => item.endsWith(itemId));
      }
    }
  };

  const like = async() => {
    console.log('like', setId, itemIds);
    if (setId === null) {
      const response = await setAPI.createLikes();
      // TODO: does likesId need to be in store?
      $root?.$store?.commit('set/setLikesId', response.id);
    }

    await setAPI.insertItems(setId.value, itemIds.value);
    await fetchLikedItems();
  };

  const unlike = async() => {
    await setAPI.deleteItems(setId.value, itemIds.value);
    await fetchLikedItems();
  };

  watchEffect(fetchLikedItems);

  return {
    like,
    likedItems: readonly(likedItems),
    unlike
  };
}
