import Vue from 'vue';
import VueMatomo from 'vue-matomo';

export const trackSiteSearch = (store) => (to) => {
  let siteSearch = null;

  if (Object.keys(to.query).some((key) => ['query', 'qa'].includes(key))) {
    // Register a site search, treating collection pages as the category
    // and passing *:* to Matomo for empty queries (as it ignores empty queries)
    const standardQuery = to.query.query === '' ? '*:*' : to.query.query || '*:*';
    const keyword = [standardQuery].concat(to.query.qa || []).join(' AND ');

    let category;
    if (to.name.startsWith('collections-type-all')) {
      category = `${to.params.type} ${to.params.pathMatch}`;
    }

    let resultsCount;
    if (store?.state?.search) {
      resultsCount = store.state.search.totalResults;
    }

    siteSearch = {
      keyword,
      category,
      resultsCount
    };
  }

  return siteSearch;
};

export default ({ app, $config: { matomo: { host, siteId } }, store }) => {
  if (!host || !siteId) {
    return;
  }

  // Docs: https://github.com/AmazingDreams/vue-matomo#readme
  Vue.use(VueMatomo, {
    router: app.router,
    host,
    siteId,
    trackSiteSearch: trackSiteSearch(store),
    requireCookieConsent: true
  });
};
