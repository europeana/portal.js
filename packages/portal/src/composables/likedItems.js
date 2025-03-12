import { computed, getCurrentInstance, ref, watchEffect } from 'vue';

const lastModified = ref(null);

export default function useLikedItems(itemIds) {
  const likedItems = ref({});

  const $root = getCurrentInstance()?.proxy?.$root;
  const setAPI = $root?.$apis?.set;
  const setId = computed(() => $root?.$store?.state.set.likesId);

  watchEffect(async() => {
    if (setAPI && setId.value && itemIds?.value) {
      const response = await setAPI.searchItems(setId.value, itemIds.value);
      likedItems.value = [].concat(itemIds.value || []).reduce((memo, itemId) => {
        memo[itemId] = (response.items || []).some((item) => item.endsWith(itemId));
        return memo;
      }, {});
    } else {
      likedItems.value = {};
    }
  });

  const touchLastModified = (() => {
    lastModified.value = Date.now();
  });

  // TODO: needs to handle multiple item ids
  const like = async(itemId) => {
    await setAPI.insertItems(setId.value, itemId);
    touchLastModified();
  };

  // TODO: needs to handle multiple item ids
  const unlike = async(itemId) => {
    await setAPI.deleteItems(setId.value, itemId);
    touchLastModified();
  };

  return {
    lastModified,
    like,
    likedItems,
    unlike
  };
}
