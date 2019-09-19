/**
 * @file Interface to Europeana Record Search API
 */

import axios from 'axios';
import qs from 'qs';
import Vue from 'vue';
export const $t = (key, opts) => Vue.prototype.$nuxt.$options.i18n.t(key, opts);

function genericThumbnail(edmType) {
  return `https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w200&uri=&type=${edmType}`;
}

/**
 * Extract the value to display for a field
 * @param {Object} field language map field from API response
 * @return {?(Object|String)} value to display
 */
function display(field) {
  if (!field) {
    return null;
  }

  let value;
  if (field.eng) {
    value = field.eng;
  } else if (field.en) {
    value = field.en;
  } else if (field.def) {
    value = field.def;
  } else if (Object.keys(field).length === 1) {
    value = field[Object.keys(field)[0]];
  } else {
    return field;
  }

  value = [...new Set(value)]; // remove duplicates
  // Remove URIs, but only if other values exist
  const withoutUris = value.filter((element) => {
    return !element.startsWith('http://') && !element.startsWith('https://');
  });
  if (withoutUris.length > 0) {
    value = withoutUris;
  }

  return value;
}

/**
 * Construct fields to display for one search result
 * @param {Object} item individual item returned by the API
 * @return {Object} fields to display for this item
 */
function fieldsForSearchResult(item) {
  let fields = {
    // TODO: fallback to description when API returns dcDescriptionLangAware
    dcTitle: item.dcTitleLangAware ? display(item.dcTitleLangAware) : [$t('messages.noTitle', { record: item.id })],
    // TODO: enable when API returns dcDescriptionLangAware
    // dcDescription: item.dcDescriptionLangAware,
    edmDataProvider: item.dataProvider
  };

  const dcCreator = display(item.dcCreatorLangAware);
  if (dcCreator) {
    fields.dcCreator = dcCreator;
  }

  return fields;
}

/**
 * Extract search results from API response
 * @param  {Object} response API response
 * @return {Object[]} search results
 */
function resultsFromApiResponse(response) {
  const items = response.data.items;

  const results = items.map(item => {
    return {
      europeanaId: item.id,
      edmPreview: item.edmPreview ? `${item.edmPreview[0]}&size=w200` : genericThumbnail(item.type),
      fields: fieldsForSearchResult(item)
    };
  });

  return results;
}

/**
 * Page to request from API based on URL query parameter
 * If parameter is not present, returns default of page 1.
 * If parameter is present, and represents a positive integer, return it
 * typecast to Number.
 * Otherwise, parameter is invalid for page number, and return `null`.
 * @param {string} queryPage `page` query parameter from URL
 * @return {?number}
 */
export function pageFromQuery(queryPage) {
  if (queryPage) {
    if (/^[1-9]\d*$/.test(queryPage)) {
      return Number(queryPage);
    } else {
      return null;
    }
  } else {
    return 1;
  }
}

/**
 * A set of selected facets from the user's request.
 *
 * The object is keyed by the facet name, each property being an array of
 * selected values.
 *
 * For example:
 * ```
 * {
 *   "TYPE": ["IMAGE", "VIDEO"]
 * }
 * ```
 * @typedef {Object.<string, Array>} SelectedFacetSet
 */

/**
 * Extract selected facets from URL `qf`, `reusability` and `theme` value(s)
 * @param {Object} query URL query parameters
 * @return {SelectedFacetSet} selected facets
 */
export function selectedFacetsFromQuery(query) {
  let selectedFacets = {};
  if (query.qf) {
    for (const qf of [query.qf].flat()) {
      const qfParts = qf.split(':');
      const facetName = qfParts[0];
      const facetValue = qfParts[1].match(/^".*"$/) ? qfParts[1].slice(1, -1) : qfParts[1]; // Slice only if double quotes exist
      if (typeof selectedFacets[facetName] === 'undefined') {
        selectedFacets[facetName] = [];
      }
      selectedFacets[facetName].push(facetValue);
    }
  }
  if (query.reusability) {
    selectedFacets['REUSABILITY'] = query.reusability.split(',');
  }

  if (query.theme) {
    selectedFacets['THEME'] = query.theme;
  }

  return selectedFacets;
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
 * @param {string} params.wskey API key
 * @return {{results: Object[], totalResults: number, facets: FacetSet, error: string}} search results for display
 */
function search(params) {
  const maxResults = 1000;
  const perPage = Number(params.rows) || 24;
  const page = params.page || 1;

  const start = ((page - 1) * perPage) + 1;
  const rows = Math.max(0, Math.min(maxResults + 1 - start, perPage));

  return axios.get('https://api.europeana.eu/api/v2/search.json', {
    paramsSerializer(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
    params: {
      profile: 'minimal,facets',
      facet: params.facet,
      query: params.query === '' ? '*:*' : params.query,
      qf: qfHandler(params.qf),
      reusability: params.reusability,
      theme: params.theme,
      rows,
      start,
      wskey: params.wskey
    }
  })
    .then((response) => {
      return {
        error: null,
        results: resultsFromApiResponse(response),
        facets: response.data.facets || null,
        totalResults: response.data.totalResults,
        lastAvailablePage: start + perPage > maxResults
      };
    })
    .catch((error) => {
      const message = error.response ? error.response.data.error : error.message;
      throw new Error(message);
    });
}

/**
 * Apply content tier filtering to the qf param.
 * If not present will filter to tier 1-4 content.
 * If present and of value '*' will be removed.
 * If present and any other value will be passed along as is.
 * @param {(string|string[])} params.qf query filter(s) as passed into the search plugin.
 * @return {string[]} qf adjusted with the desired content tier filter
 */
export function qfHandler(qf) {
  let newQf = qf ? [].concat(qf) : [];
  if (!newQf.some(v => /^contentTier:/.test(v))) {
    // If no content tier qf is queried, tier 0 content is
    // excluded by default as it is considered not to meet
    // Europeana's publishing criteria.
    newQf.push('contentTier:(1 OR 2 OR 3 OR 4)');
  }
  // contentTier:* is irrelevant so is removed
  newQf = newQf.filter(v => v !== 'contentTier:*');
  return newQf;
}

export default search;
