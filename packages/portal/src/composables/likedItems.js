import { computed, getCurrentInstance, ref, watchEffect } from 'vue';

export default function useLikedItems(itemIds) {
  const $root = getCurrentInstance()?.proxy?.$root;
  const setAPI = $root.$apis?.set;

  const likedItems = ref([]);

  const setId = computed(() => $root.$store.state.set.likesId);

  watchEffect(async() => {
    console.log('watchEffect searchItems setId', setId.value);
    console.log('watchEffect searchItems itemIds', itemIds.value);
    if (setId.value && itemIds.value) {
      console.log('watchEffect searchItems calling setAPI.searchItems');
      // FIXME: this always fails due to the Set API endpoint for searching for
      //        items within a set always failing on cross-origin requests,
      //        responding with 403 Invalid CORS request
      const response = await setAPI.searchItems(setId.value, itemIds.value);
      likedItems.value = response.items;
    } else {
      likedItems.value = [];
    }
  });

  return {
    likedItems
  };
}
