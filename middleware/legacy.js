// This middleware is responsible for handling redirects for legacy URLs used on
// previous versions of the Europeana Portal.

function stringifyPathChunks(chunks) {
  return chunks.filter((chunk) => typeof chunk !== undefined).join('');
}

const rules = [
  // Remove legacy /portal prefix
  (routePath) => {
    const legacyPortalPrefixPattern = /^\/portal(\/.*)$/;
    const legacyPortalPrefixMatch = routePath.match(legacyPortalPrefixPattern);
    return legacyPortalPrefixMatch ? legacyPortalPrefixMatch[1] : null;
  },
  // Redirect legacy entity page URLs
  (routePath) => {
    const legacyAgentEntityPagePattern = /^(\/[a-z]{2})?(\/explore\/(people|topics))(\/[0-9]+)/;
    const legacyAgentEntityPageMatch = routePath.match(legacyAgentEntityPagePattern);
    return legacyAgentEntityPageMatch ? stringifyPathChunks([
      legacyAgentEntityPageMatch[1],
      legacyAgentEntityPageMatch[2].replace('/explore', '/entity').replace('/people', '/person').replace('/topics', '/topic'),
      legacyAgentEntityPageMatch[4]
    ]) : null;
  },
  // Remove .html suffix
  (routePath) => {
    const legacyHTMLSuffixPattern = /^(.+)\.html$/;
    const legacyHTMLSuffixMatch = routePath.match(legacyHTMLSuffixPattern);
    return legacyHTMLSuffixMatch ? stringifyPathChunks(legacyHTMLSuffixMatch.slice(1)) : null;
  }
];

export default ({ redirect, route }) => {
  for (const rule of rules) {
    const redirectPath = rule(route.path);
    if (redirectPath) {
      const redirectRoute = {
        path: redirectPath
      };
      if (route.query) redirectRoute.query = route.query;
      // TODO: instead of returning here, should we keep looping over other rules
      //       so multiple rules get applied all at once?
      return redirect(redirectRoute);
    }
  }
};
