import { computed, getCurrentInstance } from 'vue';

import { useRoute } from './vueRouter.js';

// TODO: the routes should be shared across components, i.e. not re-initialised
//       on each use
export function useAuthRoutes() {
  const instance = getCurrentInstance();
  const $root = instance.proxy.$root;
  const route = useRoute();

  const loginRedirectPath = computed(() => {
    // TODO: this should be derived, from auth path config
    if (route.value.name.startsWith('auth')) {
      return $root.localePath('/');
    }
    return route.value.fullPath;
  });

  const loginRoute = computed(() => {
    return {
      path: $root.localePath('/auth/login'),
      query: { redirect: loginRedirectPath.value }
    };
  });

  // TODO: refactor so that each page can register its own logout redirect path
  //       (if needed)
  const logoutRedirectPath = computed(() => {
    // TODO: this should be derived, from auth path config, and whether the current
    //       page uses the auth middleware
    if (route.value.name.startsWith('account') || route.value.name.startsWith('auth')) {
      return $root.localePath('/');
    } else if (route.value.name.startsWith('item-all')) {
      if (route.value.query.lang) {
        // rm lang from query
        const query = new URLSearchParams(route.value.query);
        query.delete('lang');
        return `${route.value.path}?${query.toString()}`;
      }
    }
    return route.value.fullPath;
  });

  const logoutRoute = computed(() => {
    return {
      path: $root.localePath('/auth/logout'),
      query: { redirect: logoutRedirectPath.value }
    };
  });

  return {
    loginRoute,
    logoutRoute
  };
}

