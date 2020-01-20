// This middleware is responsible for handling redirects for legacy URLs used on
// previous versions of the Europeana Portal.

import search from './rules/search';
import portal from './rules/portal';
import entity from './rules/entity';
import html from './rules/html';
import staticPages from './rules/static-pages';

// Order matters. Do not re-order arbitrarily.
const rules = [
  search,
  entity,
  html,
  staticPages,
  portal
];

function stringifyPathChunks(chunks) {
  return chunks.filter((chunk) => typeof chunk !== undefined).join('');
}

export default ({ redirect, route, query }) => {
  if (!/^\/portal(\/|$)/.test(route.path)) return;

  for (const rule of rules) {
    const redirectRoute = rule(route, query);

    if (redirectRoute) {
      if (Array.isArray(redirectRoute.path)) redirectRoute.path = stringifyPathChunks(redirectRoute.path);
      if (!redirectRoute.query && query) redirectRoute.query = query;

      // TODO: instead of returning here, should we keep looping over other rules
      //       so multiple rules get applied all at once?
      return redirect(redirectRoute.path, redirectRoute.query);
    }
  }
};
