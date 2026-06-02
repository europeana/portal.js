import { computed, onBeforeMount, ref, watch } from 'vue';
// vue-router for vue 2 does not export useRoute and useRouter as in v3;
// vue2-helpers provides helpers that do
import { useRoute, useRouter } from 'vue2-helpers/vue-router';

export default function useActiveTab(tabIds, options = {}) {
  const { replaceRoute, query } = {
    replaceRoute: true,
    query: null,
    ...options
  };
  const routerUpdateAction = replaceRoute ? 'replace' : 'push';

  const router = useRouter();
  const route = useRoute();
  const activeTabIndex = ref(-1);
  const activeTabHistory = ref([]);

  const tabHashes = computed(() => tabIds.map((id) => `#${id}`));

  const setActiveTabIndexFromRouteHash = () => {
    if (!route.hash) {
      activeTabIndex.value = 0;
      activeTabHistory.value.push(activeTabId.value);
    } else if (tabHashes.value.includes(route.hash)) {
      activeTabIndex.value = tabHashes.value.indexOf(route.hash);
      activeTabHistory.value.push(activeTabId.value);
    }
  };

  const setActiveTabIndexFromRouteQuery = () => {
    if (!route.query?.[query]) {
      activeTabIndex.value = 0;
      activeTabHistory.value.push(activeTabId.value);
    } else if (tabIds.includes(route.query?.[query])) {
      activeTabIndex.value = tabIds.indexOf(route.query[query]);
      activeTabHistory.value.push(activeTabId.value);
    }
  };

  const setActiveTabIndexFromRoute = () => {
    if (route) {
      if (query) {
        setActiveTabIndexFromRouteQuery();
      } else {
        setActiveTabIndexFromRouteHash();
      }
    }
  };

  const activeTabHash = computed(() => {
    return tabHashes.value[activeTabIndex.value];
  });

  const activeTabId = computed(() => {
    return tabIds[activeTabIndex.value];
  });

  let unwatchTabIndex = () => {};

  const watchTabIndex = () => {
    // unwatch 1st to prevent duplicate watchers
    unwatchTabIndex();

    if (activeTabIndex.value !== -1) {
      activeTabHistory.value.push(activeTabId.value);
      if (activeTabHash.value !== route.hash) {
        updateRoute();
      }
    }

    unwatchTabIndex = watch(activeTabIndex, () => {
      if (activeTabIndex.value !== -1) {
        activeTabHistory.value.push(activeTabId.value);
        updateRoute();
      }
    });
  };

  const updateRoute = () => {
    if (query) {
      router[routerUpdateAction]({ ...route, query: { [query]: activeTabId.value }, hash: undefined });
    } else {
      router[routerUpdateAction]({ ...route, hash: activeTabHash.value });
    }
  };

  if (route) {
    watch(route, () => {
      setActiveTabIndexFromRoute();
    });
  }

  onBeforeMount(() => {
    setActiveTabIndexFromRoute();
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
