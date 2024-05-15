/**
 * @file Interface to Europeana Record API search method
 */

import pick from 'lodash/pick.js';

import { isLangMap, reduceLangMapsForLocale } from '@europeana/i18n';
import { escapeLuceneSpecials, truncate } from '@europeana/utils';

/**
 * Search Europeana Record API
 * @param {Object} params parameters for search query, passed unaltered unless noted
 * @param {number} params.page page of results to retrieve, converted to `start`
 * @param {number} params.rows number of results to retrieve per page, defaults to 24
 * @param {string} params.query search query, defaults to *:*
 * @param {Object} options search options
 * @param {Boolean} options.escape whether or not to escape Lucene reserved characters in the search query
 * @param {string} options.locale current locale, for localising search results
 * @param {string} options.url override the API URL
 * @return {{items: Object[], totalResults: number, facets: Array, lastAvailablePage: number}} search results for display
 */
export default function search(params, options = {}) {
  const localParams = { ...params };

  const defaultOptions = { locale: this.context?.i18n?.locale };
  const localOptions = { ...defaultOptions, ...options };

  const maxResults = 1000;
  const perPage = localParams.rows === undefined ? 24 : Number(localParams.rows);

  const page = localParams.page || 1;
  delete localParams.page;
  const start = ((page - 1) * perPage) + 1;
  const rows = Math.max(0, Math.min(maxResults + 1 - start, perPage));
  const query = params.query || '*:*';

  const searchParams = {
    ...localParams,
    profile: localParams.profile || '',
    query: options.escape ? escapeLuceneSpecials(query) : query,
    rows,
    start
  };

  return this.request({
    method: 'get',
    url: `${options.url || ''}/search.json`,
    params: searchParams
  })
    .then((data) => ({
      ...data,
      items: data.items?.map((item) => reduceFieldsForItem(item, localOptions.locale)),
      lastAvailablePage: start + perPage > maxResults
    }));
}

// TODO: this should be the responsibility of the caller; move to a utility
//       function for callers to run after, when needed; alternatively,
//       add a `pick` option to `search()`
/**
 * Pick fields we need for search result display, in the absence of support
 * for specifying fields to request from the API.
 */
const reduceFieldsForItem = (item, locale) => {
  item = pick(item,
    [
      'dataProvider',
      'dcCreatorLangAware',
      'dcDescriptionLangAware',
      'dcTitleLangAware',
      'edmPreview',
      'id',
      'type',
      'rights'
    ]
  );

  // Reduce lang maps to values needed for user's locale.
  item = reduceLangMapsForLocale(item, locale, { freeze: false });

  // Truncate lang map values
  for (const field in item) {
    if (isLangMap(item[field])) {
      for (const locale in item[field]) {
        item[field][locale] = []
          .concat(item[field][locale])
          .map(value => truncate(value, 256));
      }
    }
  }

  return Object.freeze(item);
};
