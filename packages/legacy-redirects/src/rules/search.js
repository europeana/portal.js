// Redirect legacy search query parameters

import qs from 'qs';

import { UNQUOTABLE_FACETS } from '@europeana/constants';
import { escapeLuceneSpecials } from '@europeana/utils';

export const collectionToThemeMap = {
  'world-war-I': 'ww1',
  'industrial-heritage': 'industrial',
  'manuscripts': 'manuscript',
  'maps': 'map',
  'natural-history': 'nature',
  'newspapers': 'newspaper'
};

function mapCollectionToTheme(collection) {
  return collectionToThemeMap[collection] || collection;
}

const queryFacetParameterMappings = {
  default(query, key, value) {
    for (const filterValue of [].concat(value)) {
      let queryFilterValue;
      if (UNQUOTABLE_FACETS.includes(key) || filterValue.includes('*')) {
        queryFilterValue = filterValue;
      } else {
        queryFilterValue = '"' + escapeLuceneSpecials(filterValue) + '"';
      }
      query.qf.push(`${key}:${queryFilterValue}`);
    }
  },
  'REUSABILITY'(query, key, value) {
    query.reusability = [].concat(value).join(',');
  },
  api(query, key, value) {
    const apiFilter = [].concat(value)[0];
    if (apiFilter === 'default') {
      query.api = 'metadata';
    } else if (apiFilter === 'api') {
      query.api = 'fulltext';
    }
  }
};

const queryParameterMappings = {
  default(query, key, value) {
    if (Array.isArray(query[key])) {
      query[key] = query[key].concat([].concat(value));
    } else {
      query[key] = value;
    }
  },
  page(query) {
    delete query.page;
  },
  per_page(query) { // eslint-disable-line camelcase
    delete query.per_page;
  },
  q(query, key, value) {
    query.query.unshift(value);
  },
  qf(query, key, value) {
    query.query = query.query.concat([].concat(value));
  },
  f(query, key, value) {
    for (const field in value) {
      if (queryFacetParameterMappings[field]) {
        queryFacetParameterMappings[field](query, field, value[field]);
      } else {
        queryFacetParameterMappings.default(query, field, value[field]);
      }
    }
  },
  range(query, key, value) {
    for (const field in value) {
      const rangeBegin = value[field]['begin'] || '*';
      const rangeEnd = value[field]['end'] || '*';
      if (rangeBegin === rangeEnd) {
        query.qf.push(`${field}:${rangeBegin}`);
      } else {
        query.qf.push(`${field}:[${rangeBegin} TO ${rangeEnd}]`);
      }
    }
  }
};

function mapQueryParameter(query, key, value) {
  if (queryParameterMappings[key]) {
    queryParameterMappings[key](query, key, value);
  } else {
    queryParameterMappings.default(query, key, value);
  }
}

function baseRedirect(req, query = {}) {
  const redirect = {
    query: {
      query: [],
      qf: []
    }
  };

  const pattern = /^\/portal(\/[a-z]{2})?(\/search)$/;
  const match = req.path.match(pattern);
  if (match) {
    redirect.path = match.slice(1);
  } else {
    const collectionPattern = /^\/portal(\/[a-z]{2})?\/collections\/([^/]+)$/;
    const collectionMatch = req.path.match(collectionPattern);
    if (collectionMatch && Object.prototype.hasOwnProperty.call(query, 'q')) {
      redirect.path = [collectionMatch[1], '/search'];
      redirect.query.qf.push(`collection:${mapCollectionToTheme(collectionMatch[2])}`);
    }
  }

  return redirect;
}

export default (req) => {
  const query = qs.parse(req.url.split('?')[1] || '');

  const redirect = baseRedirect(req, query);

  if (!redirect.path) {
    return null;
  }

  for (const key in query) {
    const value = query[key];
    mapQueryParameter(redirect.query, key, value);
  }

  redirect.query.query = redirect.query.query.join(' AND ');
  if (redirect.query.qf.length === 0) {
    delete redirect.query.qf;
  } else if (redirect.query.qf.length === 1) {
    redirect.query.qf = redirect.query.qf[0];
  }

  return redirect;
};
