// This middleware is responsible for handling redirects for legacy URLs used on
// previous versions of the Europeana Portal.

import qs from 'qs';

import entity from './rules/entity.js';
import exhibitions from './rules/exhibitions.js';
import explore from './rules/explore.js';
import galleries from './rules/galleries.js';
import html from './rules/html.js';
import portal from './rules/portal.js';
import record from './rules/record.js';
import search from './rules/search.js';
import staticPages from './rules/static-pages.js';

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

export default (req, res) => {
  // FIXME
  //   if (/^\/[a-z]{2}\/portal(\/$|$)/.test(req.path)) {
  //     updateRoute({ status: 302, route: req.path.match(/^(\/[a-z]{2})/)[1], req, redirect, app });
  //     return;
  //   }

  for (const rule of rules) {
    const redirectRoute = rule(req);

    if (redirectRoute) {
      if (Array.isArray(redirectRoute.path)) {
        redirectRoute.path = stringifyPathChunks(redirectRoute.path);
      }
      if (!redirectRoute.query && req.query) {
        redirectRoute.query = req.query;
      }
      if (!redirectRoute.status) {
        redirectRoute.status = 301;
      }

      const url = `${redirectRoute.path}?${qs.stringify(redirectRoute.query)}`;

      res.redirect(redirectRoute.status, url);

      return;
    }
  }

  // TODO: 404? shouldn't ever get here though, with the /portal routing
};
