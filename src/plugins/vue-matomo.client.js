import Vue from 'vue';
import VueMatomo from 'vue-matomo';

export const trackSiteSearch = (store) => (to) => {
  let siteSearch = null;

  if (Object.keys(to.query).includes('query')) {
    // Register a site search, treating collection pages as the category
    // and passing *:* to Matomo for empty queries (as it ignores empty queries)
    const keyword = to.query.query === '' ? '*:*' : to.query.query;

    let category;
    if (to.name.startsWith('collections-type-all')) {
      category = `${to.params.type} ${to.params.pathMatch}`;
    }

    let resultsCount;
    if (store && store.state && store.state.search) {
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

// TODO: reject immediately if Matomo config not set?
function waitForMatomo() {
  const that = this;

  return new Promise((resolve, reject) => {
    const attempt = (counter = 0) => {
      if (counter >= 20) {
        return reject('No Matomo');
      } else if (that.$matomo) {
        return resolve();
      } else {
        return setTimeout(() => attempt(counter + 1), 100);
      }
    };
    return attempt();
  });
}

export default ({ app, $config: { matomo: { host, siteId } }, store }, inject) => {
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

  inject('waitForMatomo', waitForMatomo);
};
