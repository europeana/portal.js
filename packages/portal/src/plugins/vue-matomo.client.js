import Vue from 'vue';
import VueMatomo from 'vue-matomo';
import waitFor from '@/utils/waitFor.js';

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

export default ({ app, $config, store }) => {
  const config = $config?.matomo;
  const trackers = [];

  if (config?.host && config?.siteId) {
    trackers.push({
      host: config.host,
      siteId: config.siteId
    });
  }

  if (config?.trackers) {
    config.trackers.forEach((tracker) => {
      if (tracker.host && tracker.siteId) {
        trackers.push(tracker);
      }
    });
  }

  if (trackers.length === 0) {
    return;
  }

  // Docs: https://github.com/AmazingDreams/vue-matomo#readme
  Vue.use(VueMatomo, {
    router: app.router,
    host: trackers[0].host,
    siteId: trackers[0].siteId,
    trackSiteSearch: trackSiteSearch(store),
    requireCookieConsent: true
  });

  if (trackers.length > 1) {
    waitFor(() => Vue.prototype.$matomo, config.loadWait)
      .then(() => {
        trackers.slice(1).forEach((tracker) => {
          console.log('adding tracker', tracker.host, tracker.siteId);
          Vue.prototype.$matomo.addTracker(`${tracker.host}/matomo.php`, tracker.siteId);
        });
      });
  }
};
