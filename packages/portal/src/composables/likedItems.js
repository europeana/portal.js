import { computed, getCurrentInstance, ref, watchEffect } from 'vue';

export function useLikedItems(itemIds = null) {
  const likedItems = ref({});

  const $root = getCurrentInstance()?.proxy?.$root;
  const setAPI = $root?.$apis?.set;
  const setId = computed(() => $root?.$store?.state.set.likesId);

  const fetchLikedItems = async() => {
    if (setAPI && setId.value && itemIds?.value) {
      const response = await setAPI.searchItems(setId.value, itemIds.value);

      for (const itemId of [].concat(itemIds.value)) {
        likedItems.value[itemId] = (response.items || []).some((item) => item.endsWith(itemId));
      }
    }
  };

  const like = async() => {
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
    likedItems: computed(() => likedItems.value),
    unlike
  };
}
