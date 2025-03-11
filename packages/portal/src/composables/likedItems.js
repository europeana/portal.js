import { computed, getCurrentInstance, ref, watchEffect } from 'vue';

export default function useLikedItems(itemIds) {
  const $root = getCurrentInstance()?.proxy?.$root;
  const setAPI = $root.$apis?.set;

  const likedItems = ref({});

  const setId = computed(() => $root.$store.state.set.likesId);

  watchEffect(async() => {
    if (setId.value && itemIds.value) {
      const response = await setAPI.searchItems(setId.value, itemIds.value);
      likedItems.value = [].concat(itemIds.value || []).reduce((memo, itemId) => {
        memo[itemId] = (response.items || []).some((item) => item.endsWith(itemId));
        return memo;
      }, {});
    } else {
      likedItems.value = {};
    }
  });

  return {
    likedItems
  };
}
