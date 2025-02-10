// This would ideally be a composable, but couldn't get that working wrt
// provision of baseUrl, i18n and route from Options API setup function where
// there is no vue/nuxt context available, and lack of v3 helpers like useContext
export default function createCanonicalUrl({ baseUrl, i18n, route } = {}) {
  const removeLocaleFromPath = (path) => {
    if (route.path === `/${i18n.locale}`) {
      return path.replace(i18n.locale, '');
    } else if (path.startsWith(`/${i18n.locale}/`)) {
      return path.slice(3);
    }
    return path;
  };

  const withBothLocaleAndQuery = `${baseUrl}${route.fullPath}`;

  const withOnlyQuery = `${baseUrl}${removeLocaleFromPath(route.fullPath)}`;

  const withOnlyLocale = `${baseUrl}${route.path}`;

  const withNeitherLocaleNorQuery = `${baseUrl}${removeLocaleFromPath(route.path)}`;

  return {
    withBothLocaleAndQuery,
    withOnlyQuery,
    withOnlyLocale,
    withNeitherLocaleNorQuery
  };
}
