/**
 * @file Interface to Europeana Record Search API
 */

import qs from 'qs';
import pick from 'lodash/pick';

import {
  apiError, escapeLuceneSpecials, isLangMap, reduceLangMapsForLocale
} from './utils';
import { truncate } from '../vue-filters';

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
  if (matches === null) {
    return null;
  }
  const start = matches[1] === '*' ? null : matches[1];
  const end = matches[2] === '*' ? null : matches[2];

  return { start, end };
}

/**
 * Search Europeana Record API
 * @param {Object} $axios Axios instance for Record API
 * @param {Object} params parameters for search query
 * @param {number} params.page page of results to retrieve
 * @param {number} params.rows number of results to retrieve per page
 * @param {string} params.reusability reusability filter
 * @param {string} params.facet facet names, comma separated
 * @param {(string|string[])} params.qf query filter(s)
 * @param {string} params.query search query
 * @param {string} params.wskey API key, to override `config.record.key`
 * @param {Object} options search options
 * @param {Boolean} options.escape whether or not to escape Lucene reserved characters in the search query
 * @param {string} options.locale source locale for multilingual search
 * @param {string} options.url override the API URL
 * @return {{results: Object[], totalResults: number, facets: FacetSet, error: string}} search results for display
 */
export default function search($axios, params, options = {}) {
  const maxResults = 1000;
  const perPage = params.rows === undefined ? 24 : Number(params.rows);
  const page = params.page || 1;
  const start = ((page - 1) * perPage) + 1;
  const rows = Math.max(0, Math.min(maxResults + 1 - start, perPage));
  const query = params.query || '*:*';

  const searchParams = {
    ...$axios.defaults.params,
    facet: params.facet,
    profile: params.profile,
    qf: addContentTierFilter(params.qf),
    query: options.escape ? escapeLuceneSpecials(query) : query,
    reusability: params.reusability,
    rows,
    start
  };
  const targetLocale = 'en';
  if (options.locale && options.locale !== targetLocale) {
    searchParams['q.source'] = options.locale;
    searchParams['q.target'] = targetLocale;
  }

  return $axios.get(`${options.url || ''}/search.json`, {
    paramsSerializer(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
    params: searchParams
  })
    .then(response => response.data)
    .then(data => ({
      ...data,
      items: data.items.map(item => reduceFieldsForItem(item, options)),
      lastAvailablePage: start + perPage > maxResults
    }))
    .catch((error) => {
      throw apiError(error);
    });
}

const reduceFieldsForItem = (item, options = {}) => {
  // Pick fields we need for search result display. See components/item/ItemPreviewCard.vue
  item = pick(item,
    [
      'dataProvider',
      'dcCreatorLangAware',
      'dcDescriptionLangAware',
      'dcTitleLangAware',
      'edmPreview',
      'id',
      'type'
    ]
  );

  // Reduce lang maps to values needed for user's locale.
  item = reduceLangMapsForLocale(item, options.locale, { freeze: false });

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
