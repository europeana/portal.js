import { computed, onMounted, watch } from 'vue';
// vue-router for vue 2 does not export useRoute and useRouter as in v3;
// vue2-helpers provides helpers that do
import { useRoute } from 'vue2-helpers/vue-router';

import useScrollTo from '@/composables/scrollTo.js';

export function useScrollToHeader() {
  const route = useRoute();
  const routeQuery = computed(() => route?.query);

  const { scrollToSelector } = useScrollTo();

  const scrollToHeader = async() => {
    // NOTE: this helps prevent lazy-loading issues when paginating in Chrome 103
    await new Promise(process.nextTick);
    process.client && scrollToSelector('#header');
  };

  watch(routeQuery, scrollToHeader);

  onMounted(scrollToHeader);

  return { scrollToHeader };
}
