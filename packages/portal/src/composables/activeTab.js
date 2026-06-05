import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from './vueRouter.js';

export default function useActiveTab(tabIds, options = {}) {
  const { replaceRoute, query } = {
    replaceRoute: true,
    query: null,
    ...options
  };

  const routerUpdateAction = replaceRoute ? 'replace' : 'push';

  const route = useRoute();
  const router = useRouter();
  const activeTabIndex = ref(-1);
  const activeTabHistory = ref([]);

  const tabHashes = computed(() => tabIds.map((id) => `#${id}`));

  const setActiveTabIndexFromRouteHash = () => {
    if (!route.value.hash) {
      activeTabIndex.value = 0;
      activeTabHistory.value.push(activeTabId.value);
    } else if (tabHashes.value.includes(route.value.hash)) {
      activeTabIndex.value = tabHashes.value.indexOf(route.value.hash);
      activeTabHistory.value.push(activeTabId.value);
    }
  };

  const setActiveTabIndexFromRouteQuery = () => {
    if (!route.value.query?.[query]) {
      activeTabIndex.value = 0;
      activeTabHistory.value.push(activeTabId.value);
    } else if (tabIds.includes(route.value.query?.[query])) {
      activeTabIndex.value = tabIds.indexOf(route.value.query[query]);
      activeTabHistory.value.push(activeTabId.value);
    }
  };

  const setActiveTabIndexFromRoute = () => {
    if (route.value) {
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
      if (activeTabHash.value !== route.value.hash) {
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
      router.value[routerUpdateAction]({ ...route.value, query: { [query]: activeTabId.value }, hash: undefined });
    } else {
      router.value[routerUpdateAction]({ ...route.value, hash: activeTabHash.value });
    }
  };

  watch(route, () => {
    setActiveTabIndexFromRoute();
  }, {
    immediate: true,
    deep: true
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
