import { ref, watch } from 'vue';
import { toRef } from '@vueuse/core';

// This would ideally be a composable, but couldn't get that working wrt
// provision of baseUrl, i18n and route from Options API setup function where
// there is no vue/nuxt context available, and lack of v3 helpers like useContext
export default function createCanonicalUrl({ baseUrl, i18n, route } = {}) {
  const baseUrlRef = toRef(baseUrl);
  const i18nRef = toRef(i18n);
  const routeRef = toRef(route);

  const removeLocaleFromPath = (path) => {
    if (routeRef.value.path === `/${i18nRef.value.locale}`) {
      return path.replace(i18nRef.value.locale, '');
    } else if (path.startsWith(`/${i18nRef.value.locale}/`)) {
      return path.slice(3);
    }
    return path;
  };

  watch(i18nRef, () => setUrls());
  watch(routeRef, () => setUrls());
  watch(baseUrlRef, () => setUrls());

  const withBothLocaleAndQuery = ref(null);
  const withOnlyQuery = ref(null);
  const withOnlyLocale = ref(null);
  const withNeitherLocaleNorQuery = ref(null);

  const setUrls = () => {
    withBothLocaleAndQuery.value = `${baseUrlRef.value}${routeRef.value.fullPath}`;

    withOnlyQuery.value = `${baseUrlRef.value}${removeLocaleFromPath(routeRef.value.fullPath)}`;

    withOnlyLocale.value = `${baseUrlRef.value}${routeRef.value.path}`;

    withNeitherLocaleNorQuery.value = `${baseUrlRef.value}${removeLocaleFromPath(routeRef.value.path)}`;
  };

  setUrls();

  return {
    withBothLocaleAndQuery,
    withNeitherLocaleNorQuery,
    withOnlyLocale,
    withOnlyQuery
  };
}
