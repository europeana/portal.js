// Redirect legacy search query parameters

import { unquotableFacets } from '../../../plugins/europeana/search';

const facetParamPattern = /^f\[([^\]]+)\]\[\]$/;

function mapQueryParameter(query, key, value) {
  if (key === 'q') {
    query.query = value;
  } else if (key === 'qf[]') {
    query.qf = query.qf.concat(value);
  } else if (key === 'f[REUSABILITY][]') {
    query.reusability = [].concat(value).join(',');
  } else if (key === 'f[api][]') {
    if (value === 'default') {
      query.api = 'metadata';
    } else if (value === 'api') {
      query.api = 'fulltext';
    }
  } else if (facetParamPattern.test(key)) {
    const facetParamMatch = key.match(facetParamPattern);
    const facetName = facetParamMatch[1];

    for (const facetValue of [].concat(value)) {
      const queryFacetValue = unquotableFacets.includes(facetName) ? facetValue : `"${facetValue}"`;
      query.qf.push(`${facetName}:${queryFacetValue}`);
    }
  } else {
    query[key] = value;
  }
}

export default (route, query = {}) => {
  // Include /portal here as otherwise the paths for search are identical
  // TODO: also handle searches within thematic collections
  const pattern = /^\/portal(\/[a-z]{2})?(\/search)$/;
  const match = route.path.match(pattern);
  if (!match) return null;

  const redirect = {
    path: match.slice(1),
    query: {
      query: '',
      qf: []
    }
  };

  for (const key in query) {
    const value = query[key];
    mapQueryParameter(redirect.query, key, value);
  }

  if (redirect.query.qf.length === 0) delete redirect.query.qf;

  return redirect;
};
