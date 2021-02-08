// This middleware is responsible for handling redirects for legacy URLs used on
// previous versions of the Europeana Portal.

import http from 'http';

import entity from './rules/entity';
import exhibitions from './rules/exhibitions';
import explore from './rules/explore';
import galleries from './rules/galleries';
import html from './rules/html';
import portal from './rules/portal';
import record from './rules/record';
import search from './rules/search';
import staticPages from './rules/static-pages';

// Order matters. Do not re-order arbitrarily.
const rules = [
  record,
  explore,
  exhibitions,
  galleries,
  search,
  entity,
  staticPages,
  html,
  portal
];

function stringifyPathChunks(chunks) {
  return chunks.filter((chunk) => typeof chunk !== undefined).join('');
}

export default ({ redirect, route, query, error }) => {
  if (/^\/[a-z]{2}\/portal(\/$|$)/.test(route.path)) return redirect(302, route.path.match(/^(\/[a-z]{2})/)[1]);
  if (!/^\/portal(\/|$)/.test(route.path)) return;

  for (const rule of rules) {
    const legacyRoute = rule(route, query);

    if (legacyRoute) {
      if (Array.isArray(legacyRoute.path)) legacyRoute.path = stringifyPathChunks(legacyRoute.path);
      if (!legacyRoute.query && query) legacyRoute.query = query;
      if (!legacyRoute.status) legacyRoute.status = 301;

      if ((legacyRoute.status >= 300) && (legacyRoute.status < 400)) {
        return redirect(legacyRoute.status, legacyRoute.path, legacyRoute.query);
      } else {
        return error({
          message: `${legacyRoute.status} ${http.STATUS_CODES[legacyRoute.status]}`,
          statusCode: legacyRoute.status
        });
      }
    }
  }
};
