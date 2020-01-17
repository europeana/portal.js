// Redirect legacy entity page URLs

import { stringifyPathChunks } from '../utils';

export default (route) => {
  const legacyAgentEntityPagePattern = /^(\/[a-z]{2})?(\/explore\/(people|topics))(\/[0-9]+)/;
  const legacyAgentEntityPageMatch = route.path.match(legacyAgentEntityPagePattern);
  return legacyAgentEntityPageMatch ? {
    path: stringifyPathChunks([
      legacyAgentEntityPageMatch[1],
      legacyAgentEntityPageMatch[2].replace('/explore', '/entity').replace('/people', '/person').replace('/topics', '/topic'),
      legacyAgentEntityPageMatch[4]
    ])
  } : null;
};
