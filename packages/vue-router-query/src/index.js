import qs from 'qs';

export const parseQuery = (query) => qs.parse(query);

// To ensure that `"query": ""` results in `?query=`, not `?query`
export const stringifyQuery = (query) => {
  const stringified = qs.stringify(query, { arrayFormat: 'repeat' });
  return stringified ? '?' + stringified : '';
};

export default {
  install(Vue, { router }) {
    if (router?.options) {
      router.options.parseQuery = parseQuery;
      router.options.stringifyQuery = stringifyQuery;
    }
  }
};
