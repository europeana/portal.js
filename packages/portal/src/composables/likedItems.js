import { computed, getCurrentInstance, ref, watchEffect } from 'vue';
import { useEventBus } from '@vueuse/core';

const eventBus = useEventBus('likedItems');

export function useLikedItems(itemIds) {
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

  return {
    eventBus,
    likedItems
  };
}
