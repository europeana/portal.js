// Redirect legacy search query parameters

import qs from 'qs';

import { unquotableFacets } from '../../../plugins/europeana/search';

function mapCollectionToTheme(collection) {
  const map = {
    'world-war-I': 'ww1',
    'industrial-heritage': 'industrial',
    'manuscripts': 'manuscript',
    'maps': 'map',
    'natural-history': 'nature',
    'newspapers': 'newspaper'
  };
  return map[collection] || collection;
}

function mapQueryParameter(query, key, value) {
  if (key === 'q') {
    query.query = value;
  } else if (key === 'qf[]') {
    query.qf = query.qf.concat(value);
  } else if (key === 'f') {
    for (const field in value) {
      if (field === 'REUSABILITY') {
        query.reusability = [].concat(value[field]).join(',');
      } else if (field === 'api') {
        const apiFilter = [].concat(value[field])[0];
        if (apiFilter === 'default') {
          query.api = 'metadata';
        } else if (apiFilter === 'api') {
          query.api = 'fulltext';
        }
      } else {
        for (const filterValue of [].concat(value[field])) {
          const queryFilterValue = unquotableFacets.includes(field) ? filterValue : `"${filterValue}"`;
          query.qf.push(`${field}:${queryFilterValue}`);
        }
      }
    }
  } else if (key === 'range') {
    for (const field in value) {
      const rangeBegin = value[field]['begin'];
      const rangeEnd = value[field]['end'];
      if (rangeBegin === rangeEnd) {
        query.qf.push(`${field}:${rangeBegin}`);
      } else {
        query.qf.push(`${field}:[${rangeBegin} TO ${rangeEnd}]`);
      }
    }
  } else {
    query[key] = value;
  }
}

function baseRedirect(route, query = {}) {
  const redirect = {
    query: {
      query: '',
      qf: []
    }
  };

  // Include /portal here as otherwise the paths for search are identical
  const pattern = /^\/portal(\/[a-z]{2})?(\/search)$/;
  const match = route.path.match(pattern);
  if (match) {
    redirect.path = match.slice(1);
  } else {
    const collectionPattern = /^\/portal(\/[a-z]{2})?\/collections\/([^/]+)$/;
    const collectionMatch = route.path.match(collectionPattern);
    if (collectionMatch && Object.prototype.hasOwnProperty.call(query, 'q')) {
      redirect.path = [collectionMatch[1], '/search'];
      redirect.query.theme = mapCollectionToTheme(collectionMatch[2]);
    }
  }

  return redirect;
}

export default (route) => {
  const query = qs.parse(route.fullPath.split('?')[1] || '');

  const redirect = baseRedirect(route, query);

  if (!redirect.path) return null;

  for (const key in query) {
    const value = query[key];
    mapQueryParameter(redirect.query, key, value);
  }

  if (redirect.query.qf.length === 0) {
    delete redirect.query.qf;
  } else if (redirect.query.qf.length === 1) {
    redirect.query.qf = redirect.query.qf[0];
  }

  return redirect;
};
