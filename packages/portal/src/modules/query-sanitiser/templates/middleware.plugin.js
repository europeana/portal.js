// When Nuxt is built, ../middleware points to .nuxt/middleware.js
import middleware from '../middleware';

import { page as sanitisePage } from './sanitise';

// Redirects non-positive integer values for `page` to `page=1`
middleware.sanitisePageQuery = ({ app, route, query, redirect, store }) => {
  const currentPage = sanitisePage(query.page);
  if (currentPage === null) {
    redirect(app.localePath({ ...route, query: { ...query, page: 1 } }));
  } else {
    store.commit('sanitised/setPage', currentPage);
  }
};
