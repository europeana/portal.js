import { computed, onBeforeMount, ref, watch } from 'vue';
// vue-router for vue 2 does not export useRoute and useRouter as in v3;
// vue2-helpers provides helpers that do
import { useRoute, useRouter } from 'vue2-helpers/vue-router';

export default function useActiveTab(tabHashes, options = {}) {
  const { replaceRoute } = {
    replaceRoute: true,
    ...options
  };
  const routerUpdateAction = replaceRoute ? 'replace' : 'push';

  const router = useRouter();
  const route = useRoute();
  const activeTabIndex = ref(-1);
  const activeTabHistory = ref([]);

  const setActiveTabIndexFromRouteHash = () => {
    if (route) {
      if (!route.hash) {
        activeTabIndex.value = 0;
        activeTabHistory.value.push(activeTabHash.value);
      } else if (tabHashes.includes(route.hash)) {
        activeTabIndex.value = tabHashes.indexOf(route.hash);
        activeTabHistory.value.push(activeTabHash.value);
      }
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
        router[routerUpdateAction]({ ...route, hash: activeTabHash.value });
      }
    }

    unwatchTabIndex = watch(activeTabIndex, () => {
      if (activeTabIndex.value !== -1) {
        activeTabHistory.value.push(activeTabHash.value);
        router[routerUpdateAction]({ ...route, hash: activeTabHash.value });
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
