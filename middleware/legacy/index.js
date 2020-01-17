// This middleware is responsible for handling redirects for legacy URLs used on
// previous versions of the Europeana Portal.

import portal from './rules/portal';
import entity from './rules/entity';
import search from './rules/search';
import html from './rules/html';
import staticPages from './rules/static-pages';

// Order matters. Do not re-order arbitrarily.
const rules = [
  portal,
  entity,
  search,
  html,
  staticPages
];

export default ({ redirect, route, query }) => {
  for (const rule of rules) {
    const redirectRoute = rule(route, query);

    if (redirectRoute) {
      if (!redirectRoute.query && query) redirectRoute.query = query;
      // TODO: instead of returning here, should we keep looping over other rules
      //       so multiple rules get applied all at once?
      return redirect(redirectRoute.path, redirectRoute.query);
    }
  }
};
