/**
 * @file Interface to Europeana Record API search method
 */

import pick from 'lodash/pick.js';

import { isLangMap, reduceLangMapsForLocale } from '@europeana/i18n';
import { escapeLuceneSpecials } from './utils.js';
import { truncate } from '../../utils/text.js';

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

export const filtersFromQf = (qfs) => {
  const filters = {};

  for (const qf of [].concat(qfs || [])) {
    const qfParts = qf.split(':');
    const name = qfParts[0];
    const value = qfParts.slice(1).join(':');
    if (typeof filters[name] === 'undefined') {
      filters[name] = [];
    }
    filters[name].push(value);
  }

  return filters;
};

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
  const matches = /^\[([^ ].*) TO ([^ ].*)\]$/.exec(paramValue);
  if (matches === null) {
    return null;
  }
  const start = matches[1] === '*' ? null : matches[1];
  const end = matches[2] === '*' ? null : matches[2];

  return { start, end };
}

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
 * @param {Boolean} options.escape whether or not to escape Lucene reserved characters in the search query
 * @param {string} options.locale current locale, for localising search results
 * @param {string} options.translateLang source locale for multilingual search
 * @param {string} options.url override the API URL
 * @return {{results: Object[], totalResults: number, facets: FacetSet, error: string}} search results for display
 */

export default function(params, options = {}) {
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
    qf: localParams.qf,
    query: options.escape ? escapeLuceneSpecials(query) : query,
    rows,
    start
  };

  // TODO: this should be the responsibility of the caller; move to an exported
  //       function for callers to run first, when needed
  if (localOptions.translateLang) {
    const targetLocale = 'en';
    if (localOptions.translateLang !== targetLocale) {
      searchParams.profile = `${searchParams.profile},translate`;
      searchParams.lang = localOptions.translateLang;
      searchParams['q.source'] = localOptions.translateLang;
      searchParams['q.target'] = targetLocale;
    }
  }

  return this.request({
    method: 'get',
    url: `${options.url || ''}/search.json`,
    params: searchParams
  })
    .then((data) => ({
      ...data,
      items: data.items?.map((item) => reduceFieldsForItem(item, localOptions)),
      lastAvailablePage: start + perPage > maxResults
    }));
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
      'type',
      'rights'
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
    // Europeana's publishing criteria.
    let contentTierFilter = '(1 OR 2 OR 3 OR 4)';

    // Exceptions:
    // 1. Tier 1 content is also excluded if this is a search filtered by collection.
    // 2. All tier content is included if filtering by organization.
    if (hasFilterForField(newQf, 'collection')) {
      contentTierFilter = '(2 OR 3 OR 4)';
    } else if (hasFilterForField(newQf, 'foaf_organization')) {
      contentTierFilter = '*';
    }
    newQf.push(`contentTier:${contentTierFilter}`);
  }

  // contentTier:* is redundant so is removed
  newQf = newQf.filter(v => v !== 'contentTier:*');

  return newQf;
}

const hasFilterForField = (filters, fieldName) => {
  return filters.some((filter) => filter.startsWith(`${fieldName}:`));
};
