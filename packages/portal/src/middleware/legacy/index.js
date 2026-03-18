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
  return chunks.filter((chunk) => !!chunk).join('');
}

const updateRoute = ({ status, route, req, redirect, app }) => {
  if (app.$apm && process.server) {
    app.$apm.setTransactionName(`${req.method} [legacy]`);
  }
  redirect(status, route);
};

const pathStartsWithLocaleThenPortal = (path) => {
  return path.slice(3, 10) === '/portal' && (path.length === 10 || path.slice(10, 11) === '/');
};

const pathStartsWithPortal = (path) => {
  return path.slice(0, 7) === '/portal' && (path.length === 7 || path.slice(7, 8) === '/');
};

const normalizeRedirectRoute = (redirectRoute, { query }) => {
  if (Array.isArray(redirectRoute.path)) {
    redirectRoute.path = stringifyPathChunks(redirectRoute.path);
  }
  if (!redirectRoute.query && query) {
    redirectRoute.query = query;
  }
  if (!redirectRoute.status) {
    redirectRoute.status = 301;
  }
  return redirectRoute;
};

const findRedirectRoute = (route, query) => {
  for (const rule of rules) {
    const redirectRoute = rule(route, query);

    if (redirectRoute) {
      return normalizeRedirectRoute(redirectRoute, { query });
    }
  }
};

export default ({ redirect, route, query, req, app }) => {
  // redirect e.g. /en/portal/about to /en/about
  if (pathStartsWithLocaleThenPortal(route.path)) {
    updateRoute({
      status: 301,
      route: {
        path: route.path.slice(0, 3) + route.path.slice(10),
        query: {}
      },
      req,
      redirect,
      app
    });
    return;
  }

  // if URL does not equal "/portal", or start with "/portal/", nothing for us to do
  if (!(pathStartsWithPortal(route.path))) {
    return;
  }

  const redirectRoute = findRedirectRoute(route, query);
  if (redirectRoute) {
    updateRoute({
      status: redirectRoute.status,
      route: {
        path: redirectRoute.path,
        query: redirectRoute.query
      },
      req,
      redirect,
      app
    });
  }
};
