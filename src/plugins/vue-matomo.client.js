import Vue from 'vue';
import VueMatomo from '@europeana/vue-matomo';

export const trackSiteSearch = (to) => {
  let siteSearch = null;

  if (Object.keys(to.query).includes('query')) {
    // register a site search, treating any collection filter as the category
    // and passing *:* to Matomo for empty query
    const keyword = to.query.query === '' ? '*:*' : to.query.query;

    let category;
    if (to.name.startsWith('collections-type-all')) {
      category = `${to.params.type} ${to.params.pathMatch}`;
    }

    siteSearch = {
      keyword,
      category
    };
  }

  return siteSearch;
};

export default ({ app, $config: { matomo: { host, siteId } } }) => {
  if (!host || !siteId) {
    return;
  }

  // Docs: https://github.com/AmazingDreams/vue-matomo#readme
  Vue.use(VueMatomo, {
    router: app.router,
    host,
    siteId,
    trackSiteSearch
  });
};
