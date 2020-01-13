// This middleware is responsible for handling redirects for legacy URLs used on
// previous versions of the Europeana Portal.

function stringifyPathMatch(regexpMatch) {
  return regexpMatch.slice(1).filter((substring) => typeof substring !== undefined).join('');
}

export default ({ redirect, route }) => {
  // Remove legacy /portal prefix
  const legacyPortalPrefixPattern = /^\/portal(\/.*)$/;
  const legacyRecordPrefixMatch = route.path.match(legacyPortalPrefixPattern);
  if (legacyRecordPrefixMatch) {
    return redirect({
      path: legacyRecordPrefixMatch[1],
      query: route.query
    });
  }

  // Remove .html from record page URLs
  const legacyRecordPagePattern = /^(\/[a-z]{2})?(\/record\/[0-9]+\/[a-zA-Z0-9_]+)\.html$/;
  const legacyRecordPageMatch = route.path.match(legacyRecordPagePattern);
  if (legacyRecordPageMatch) {
    const redirectPath = stringifyPathMatch(legacyRecordPageMatch);
    return redirect({
      path: redirectPath,
      query: route.query
    });
  }

  return;
};
