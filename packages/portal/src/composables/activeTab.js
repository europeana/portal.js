import { computed, onBeforeMount, ref, watch } from 'vue';
// vue-router for vue 2 does not export useRoute and useRouter as in v3;
// vue2-helpers provides helpers that do
import { useRoute, useRouter } from 'vue2-helpers/vue-router';

export default function useActiveTab(tabHashes) {
  const router = useRouter();
  const route = useRoute();
  const activeTabIndex = ref(-1);
  const activeTabHistory = ref([]);

  const setActiveTabIndexFromRouteHash = () => {
    if (tabHashes.includes(route?.hash)) {
      activeTabIndex.value = tabHashes.indexOf(route.hash);
      activeTabHistory.value.push(activeTabHash.value);
    }
  };

  const activeTabHash = computed(() => {
    return tabHashes[activeTabIndex.value];
  });

  let unwatchTabIndex = () => {};

  const watchTabIndex = () => {
    // unwatch 1st to prevent duplicate watchers
    unwatchTabIndex();

    if (activeTabIndex.value !== -1) {
      activeTabHistory.value.push(activeTabHash.value);
      if (activeTabHash.value !== route.hash) {
        router.replace({ ...route, hash: activeTabHash.value });
      }
    }

    unwatchTabIndex = watch(activeTabIndex, () => {
      if (route.hash && !tabHashes.includes(route.hash)) {
        return;
      }
      if (activeTabIndex.value !== -1) {
        activeTabHistory.value.push(activeTabHash.value);
        router.replace({ ...route, hash: activeTabHash.value });
      }
    });
  };

  if (route) {
    watch(route, () => {
      setActiveTabIndexFromRouteHash();
    });
  }

  onBeforeMount(() => {
    setActiveTabIndexFromRouteHash();
  });

  return {
    activeTabHash,
    activeTabHistory,
    activeTabIndex,
    unwatchTabIndex,
    watchTabIndex
  };
}
