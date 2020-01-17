// Remove .html suffix

import { stringifyPathChunks } from '../utils';

export default (route) => {
  const legacyHTMLSuffixPattern = /^(.+)\.html$/;
  const legacyHTMLSuffixMatch = route.path.match(legacyHTMLSuffixPattern);
  return legacyHTMLSuffixMatch ? {
    path: stringifyPathChunks(legacyHTMLSuffixMatch.slice(1))
  } : null;
};
