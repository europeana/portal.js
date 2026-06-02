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

  const tabIds = computed(() => tabHashes.map((hash) => hash.slice(1)));

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

  const setActiveTabIndexFromRouteQuery = () => {
    if (route) {
      if (!route.query?.tab) {
        activeTabIndex.value = 0;
        activeTabHistory.value.push(activeTabId.value);
      } else if (tabIds.value.includes(route.query.tab)) {
        activeTabIndex.value = tabIds.value.indexOf(route.query.tab);
        activeTabHistory.value.push(activeTabId.value);
      }
    }
  };

  const activeTabHash = computed(() => {
    return tabHashes[activeTabIndex.value];
  });

  const activeTabId = computed(() => {
    return tabIds.value[activeTabIndex.value];
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
      setActiveTabIndexFromRouteQuery();
    });
  }

  onBeforeMount(() => {
    setActiveTabIndexFromRouteHash();
    setActiveTabIndexFromRouteQuery();
  });

  return {
    activeTabHash,
    activeTabHistory,
    activeTabId,
    activeTabIndex,
    unwatchTabIndex,
    watchTabIndex
  };
}
