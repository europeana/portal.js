/**
 * @file Interface to Europeana Record Search API
 */

import qs from 'qs';

import { apiError } from './utils';
import { createAxios } from './record';

// Some facets do not support enquoting of their field values.
export const unquotableFacets = [
  'collection', // it _may_ be quoted, but our prewarmed filters are without
  'COLOURPALETTE',
  'IMAGE_COLOUR',
  'IMAGE_GREYSCALE', // WARNING: always returns zero results anyway
  'IMAGE_SIZE',
  'MEDIA',
  'MIME_TYPE',
  'REUSABILITY',
  'SOUND_DURATION',
  'SOUND_HQ',
  'TEXT_FULLTEXT',
  'THUMBNAIL',
  'VIDEO_HD'
];

// Thematic collections available via the `collection` qf
// filter. Order is significant as it will be reflected on search results.
export const thematicCollections = [
  'ww1',
  'archaeology',
  'art',
  'fashion',
  'industrial',
  'manuscript',
  'map',
  'migration',
  'music',
  'nature',
  'newspaper',
  'photography',
  'sport'
];

/**
 * Construct a range query from two values, if keys are omitted they will default to '*'
 * @param {Object[]} values An object containing 'start' and 'end' values
 * @return {string} The range as a value that can be used by the API
 */
export function rangeToQueryParam(values) {
  const start = values.start ? values.start : '*';
  const end = values.end ? values.end : '*';
  return `[${start} TO ${end}]`;
}

/**
 * Deconstruct a range query string value into the upper and lower bounds.
 * From/to values that are '*' will default to null.
 * @param {string} paramValue The value as a string for a qf or query as used in the search API request
 * @return {Object} Object with start and end keys
 */
export function rangeFromQueryParam(paramValue) {
  const matches = paramValue.match(/^\[([^ ].*) TO ([^ ].*)\]$/);
  if (matches === null) return null;
  const start = matches[1] === '*' ? null : matches[1];
  const end = matches[2] === '*' ? null : matches[2];

  return { start, end };
}

export default (axiosDefaults = {}) => {
  const $axios = createAxios(axiosDefaults);

  return {
    /**
     * Search Europeana Record API
     * @param {Object} params parameters for search query
     * @param {number} params.page page of results to retrieve
     * @param {number} params.rows number of results to retrieve per page
     * @param {string} params.reusability reusability filter
     * @param {string} params.facet facet names, comma separated
     * @param {(string|string[])} params.qf query filter(s)
     * @param {string} params.query search query
     * @param {string} params.wskey API key, to override `config.record.key`
     * @param {Object} options search options
     * @param {string} options.url base URL for API, overriding default `config.record.url`
     * @param {Boolean} options.escape whether or not to escape Lucene reserved characters in the search query
     * @return {{results: Object[], totalResults: number, facets: FacetSet, error: string}} search results for display
     */
    search(params, options = {}) {
      const maxResults = 1000;
      const perPage = params.rows === undefined ? 24 : Number(params.rows);
      const page = params.page || 1;
      const start = ((page - 1) * perPage) + 1;
      const rows = Math.max(0, Math.min(maxResults + 1 - start, perPage));

      const escape = options.escape || false;

      const query = (typeof params.query === 'undefined' || params.query === '') ? '*:*' : params.query;
      const escapePattern = /([!*+-=<>&|()[\]{}^~?:\\/"])/g; // Lucene reserved characters

      return $axios.get('/search.json', {
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
        params: {
          ...$axios.defaults.params,
          facet: params.facet,
          profile: params.profile,
          qf: addContentTierFilter(params.qf),
          query: escape ? query.replace(escapePattern, '\\$1') : query,
          reusability: params.reusability,
          rows,
          start
        }
      })
        .then(response => {
          return {
            ...response.data,
            lastAvailablePage: start + perPage > maxResults
          };
        })
        .catch((error) => {
          throw apiError(error);
        });
    }
  };
};

/**
 * Apply content tier filtering to the qf param.
 * If not present will filter to tier 1-4 content.
 * If present and of value '*' will be removed.
 * If present and any other value will be passed along as is.
 * @param {(string|string[])} params.qf query filter(s) as passed into the search plugin.
 * @return {string[]} qf adjusted with the desired content tier filter
 */
export function addContentTierFilter(qf) {
  let newQf = qf ? [].concat(qf) : [];
  if (!hasFilterForField(newQf, 'contentTier')) {
    // If no content tier qf is queried, tier 0 content is
    // excluded by default as it is considered not to meet
    // Europeana's publishing criteria. Also tier 1 content is exluded if this
    // is a search filtered by collection.
    const contentTierFilter = hasFilterForField(newQf, 'collection') ? '2 OR 3 OR 4' : '1 OR 2 OR 3 OR 4';
    newQf.push(`contentTier:(${contentTierFilter})`);
  }
  // contentTier:* is redundant so is removed
  newQf = newQf.filter(v => v !== 'contentTier:*');

  return newQf;
}

const hasFilterForField = (filters, fieldName) => {
  return filters.some(v => new RegExp(`^${fieldName}:`).test(v));
};
