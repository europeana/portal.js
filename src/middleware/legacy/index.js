// This middleware is responsible for handling redirects for legacy URLs used on
// previous versions of the Europeana Portal.

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

const updateRoute = ({ status, route, req, redirect, app }) => {
  if (app.$apm && process.server) {
    app.$apm.setTransactionName(`${req.method} [legacy]`);
  }
  redirect(status, route);
};

export default ({ redirect, route, query, req, app }) => {
  if (/^\/[a-z]{2}\/portal(\/$|$)/.test(route.path)) {
    updateRoute({ status: 302, route: route.path.match(/^(\/[a-z]{2})/)[1], req, redirect, app });
    return;
  }
  if (!/^\/portal(\/|$)/.test(route.path)) {
    return;
  }

  for (const rule of rules) {
    const redirectRoute = rule(route, query);

    if (redirectRoute) {
      if (Array.isArray(redirectRoute.path)) {
        redirectRoute.path = stringifyPathChunks(redirectRoute.path);
      }
      if (!redirectRoute.query && query) {
        redirectRoute.query = query;
      }
      if (!redirectRoute.status) {
        redirectRoute.status = 301;
      }

      updateRoute({ status: redirectRoute.status, route: { path: redirectRoute.path, query: redirectRoute.query }, req, redirect, app });
      return;
    }
  }
};
