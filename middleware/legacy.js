// This middleware is responsible for handling redirects for legacy URLs used on
// previous versions of the Europeana Portal.

import escapeRegExp from 'lodash/escapeRegExp';
import staticRedirects from './legacy-redirects-static';

function stringifyPathChunks(chunks) {
  return chunks.filter((chunk) => typeof chunk !== undefined).join('');
}

const rules = [
  // Remove legacy /portal prefix
  (route) => {
    const legacyPortalPrefixPattern = /^\/portal(\/.*)$/;
    const legacyPortalPrefixMatch = route.path.match(legacyPortalPrefixPattern);
    return legacyPortalPrefixMatch ? { path: legacyPortalPrefixMatch[1] } : null;
  },
  // Redirect legacy entity page URLs
  (route) => {
    const legacyAgentEntityPagePattern = /^(\/[a-z]{2})?(\/explore\/(people|topics))(\/[0-9]+)/;
    const legacyAgentEntityPageMatch = route.path.match(legacyAgentEntityPagePattern);
    return legacyAgentEntityPageMatch ? {
      path: stringifyPathChunks([
        legacyAgentEntityPageMatch[1],
        legacyAgentEntityPageMatch[2].replace('/explore', '/entity').replace('/people', '/person').replace('/topics', '/topic'),
        legacyAgentEntityPageMatch[4]
      ])
    } : null;
  },
  // Redirect legacy search query parameters
  (route, query) => {
    const pattern = /^(\/[a-z]{2})\/search$/;
    const match = route.path.match(pattern);
    if (!match) return null;

    if (!query || (!query.q && !query.f)) return null;

    const redirectRoute = { path: route.path, query: {} };
    if (query.q) {
      redirectRoute.query.query = query.q;
    }
    return redirectRoute;
  },
  // Remove .html suffix
  (route) => {
    const legacyHTMLSuffixPattern = /^(.+)\.html$/;
    const legacyHTMLSuffixMatch = route.path.match(legacyHTMLSuffixPattern);
    return legacyHTMLSuffixMatch ? {
      path: stringifyPathChunks(legacyHTMLSuffixMatch.slice(1))
    } : null;
  },
  // Static pages
  (route) => {
    for (const redirectFrom in staticRedirects) {
      const pattern = new RegExp(`^(/[a-z]{2})?${escapeRegExp(redirectFrom)}$`);
      const match = route.path.match(pattern);
      if (match) {
        return {
          path: stringifyPathChunks([
            match[1],
            staticRedirects[redirectFrom]
          ])
        };
      }
    }
    return null;
  }
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
