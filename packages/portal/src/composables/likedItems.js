import { computed, getCurrentInstance, onUnmounted, ref, watch } from 'vue';
import uniq from 'lodash/uniq';

// TODO: does itemIds need to be reactive?
export function useLikedItems(itemIds = null) {
  const $root = getCurrentInstance()?.proxy?.$root;

  const setAPI = $root?.$apis?.set;
  const setId = computed(() => $root?.$store?.state.set.likesId);

  // shared state on the Vue instance
  if (!$root.$likedItems) {
    $root.$likedItems = {
      busy: false,
      itemIds: ref([]),
      liked: ref([])
    };
  }

  const liked = computed(() => [].concat(itemIds)
    .every((itemId) => $root.$likedItems.liked.value.some((uri) => uri.endsWith(itemId)))
  );

  const fetchLikedItems = async() => {
    // await next tick so that multiple components may register interest
    // before we batch their item IDs together for a single Set API
    // request to establish liked status
    // TODO: is this needed?
    // await $root.$nextTick();

    // prevent multiple components doing the same work on shared data
    if ($root.$likedItems.busy) {
      return;
    } else {
      $root.$likedItems.busy = true;
    }

    if (setAPI && setId.value && itemIds) {
      console.log('fetching likes', $root.$likedItems.itemIds.value.flat().length);
      // TODO: what is the limit to how many item ids this can handle?
      const response = await setAPI.searchItems(setId.value, uniq($root.$likedItems.itemIds.value.flat()));
      $root.$likedItems.liked.value = response.items || [];
    }

    $root.$likedItems.busy = false;
  };

  watch($root.$likedItems.itemIds.value, async(newVal, oldVal) => {
    await $root.$nextTick();
    console.log('watch', newVal.length, oldVal.length);
    if (newVal.length >= oldVal.length) {
      // i.e. don't bother refetching just because of the onUnmounted hook
      await fetchLikedItems();
    }
  });

  $root.$likedItems.itemIds.value.push(itemIds);

  onUnmounted(() => {
    console.log('onUnmounted');
    $root.$likedItems.itemIds.value.splice($root.$likedItems.itemIds.value.indexOf(itemIds));
  });

  const like = async() => {
    if (setId === null) {
      const response = await setAPI.createLikes();
      // TODO: does likesId need to be in store?
      $root?.$store?.commit('set/setLikesId', response.id);
    }

    await setAPI.insertItems(setId.value, itemIds);
    await fetchLikedItems();
  };

  const unlike = async() => {
    await setAPI.deleteItems(setId.value, itemIds);
    await fetchLikedItems();
  };

  return {
    liked,
    like,
    unlike
  };
}
