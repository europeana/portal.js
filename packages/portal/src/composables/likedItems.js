import { computed, getCurrentInstance, readonly, ref, watch } from 'vue';
import uniq from 'lodash/uniq';

// TODO: check effect on SSR
// TODO: only for auth'd users (and only CSR?)
// TODO: do we need the busy thing again? to debounce watching
// TODO: provide via a plugin instead of using in the layout?
//       or use a top-level watch for shared state?
export function useLikedItems() {
  const $root = getCurrentInstance()?.proxy?.$root;

  const setAPI = $root?.$apis?.set;
  const setId = computed(() => $root?.$store?.state.set.likesId);
  const registeredItemIds = ref([]);
  const liked = ref([]);

  // shared state on the Vue instance
  // if (!$root.$likedItems) {
  //   $root.$likedItems = {
  //     busy: false,
  //     itemIds: ref([]),
  //     liked: ref([])
  //   };
  // }

  // const liked = computed(() => [].concat(itemIds.value.flat())
  //   .every((itemId) => liked.value.some((uri) => uri.endsWith(itemId)))
  // );

  let fetching;

  const fetchLikedItems = async() => {
    if (fetching) {
      return;
    }
    fetching = true;
    if (setAPI && setId.value && registeredItemIds.value.length) {
      console.log('[useLikedItems] fetching likes', registeredItemIds.value.flat().length);
      // TODO: what is the limit to how many item ids this can handle?
      const response = await setAPI.searchItems(setId.value, uniq(registeredItemIds.value.flat()));
      liked.value = response.items || [];
    }
    fetching = false;
  };

  // watch(registeredItemIds.value, async(newVal, oldVal) => {
  //   console.log('[useLikedItems] watch registeredItemIds.value',
  //     JSON.stringify(oldVal.length, null, 2),
  //     JSON.stringify(newVal.length, null, 2)
  //   );
  //   await $root.$nextTick();
  //   if (newVal.length > oldVal.length) {
  //     // don't refetch unless the number increases, e.g. not if triggered by the onUmounted hook
  //     await fetchLikedItems();
  //   }
  // });

  const register = async(itemIds) => {
    // console.log('[useLikedItems] register', itemIds);
    registeredItemIds.value.push(itemIds);
    await $root.$nextTick();
    await fetchLikedItems();
  };

  const unregister = (itemIds) => {
    // console.log('[useLikedItems] unregister', itemIds);
    registeredItemIds.value.splice(registeredItemIds.value.indexOf(itemIds), 1);
  };

  const like = async(itemIds) => {
    if (setId === null) {
      const response = await setAPI.createLikes();
      // TODO: does likesId need to be in store?
      $root?.$store?.commit('set/setLikesId', response.id);
    }

    await setAPI.insertItems(setId.value, itemIds);
    await fetchLikedItems();
  };

  const unlike = async(itemIds) => {
    await setAPI.deleteItems(setId.value, itemIds);
    await fetchLikedItems();
  };

  return {
    liked: readonly(liked),
    like,
    register,
    unlike,
    unregister
  };
}
