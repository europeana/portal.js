/**
 * @file Interface to Europeana Record API search method
 */

import { escapeLuceneSpecials } from '@europeana/utils';

/**
 * Search Europeana Record API
 * @param {Object} params parameters for search query, passed unaltered unless noted
 * @param {number} params.page page of results to retrieve, converted to `start`
 * @param {number} params.rows number of results to retrieve per page, defaults to 24
 * @param {string} params.query search query, defaults to *:*
 * @param {Object} options search options
 * @param {Boolean} options.escape whether or not to escape Lucene reserved characters in the search query
 * @param {string} options.url override the API URL
 * @return {{items: Object[], totalResults: number, facets: Array, lastAvailablePage: number}} search results for display
 */
export default function search(params, options = {}) {
  const localParams = { ...params };

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
      lastAvailablePage: start + perPage > maxResults
    }));
}
