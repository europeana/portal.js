/**
 * @file Interface to Europeana Record API search method
 */

import pick from 'lodash/pick.js';

import { isLangMap, reduceLangMapsForLocale } from '@europeana/i18n';
import { escapeLuceneSpecials, truncate } from '@europeana/utils';

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
