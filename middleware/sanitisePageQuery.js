// Redirects non-positive integer values for `page` to `page=1`

import { pageFromQuery } from '../plugins/utils';

export default ({ app, route, query, redirect }) => {
  const currentPage = pageFromQuery(query.page);
  if (currentPage === null) {
    return redirect(app.$path({ ...route, query: { ...query, page: 1 } }));
  }
};
