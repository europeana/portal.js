import { computed, getCurrentInstance } from 'vue';
import { useRoute } from 'vue2-helpers/vue-router';

// TODO: the routes should be shared across components, i.e. not re-initialised
//       on each use
export function useAuthRoutes() {
  const instance = getCurrentInstance();
  const $root = instance.proxy.$root;
  const route = useRoute();

  const loginRedirectPath = computed(() => {
    // TODO: this should be derived, from auth path config
    if (route.name.startsWith('auth')) {
      return $root.localePath('/');
    }
    return route.fullPath;
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
    if (route.name.startsWith('account') || route.name.startsWith('auth')) {
      return $root.localePath('/');
    } else if (route.name.startsWith('item-all')) {
      if (route.query.lang) {
        // rm lang from query
        const query = new URLSearchParams(route.query);
        query.delete('lang');
        return `${route.path}?${query.toString()}`;
      }
    }
    return route.fullPath;
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

