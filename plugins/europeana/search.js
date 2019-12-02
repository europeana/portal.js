/**
 * @file Interface to Europeana Record Search API
 */

import { apiError } from './utils';
import axios from 'axios';
import qs from 'qs';

// Default facets to request and display if none are specified.
// Order is significant as it will be reflected on search results.
export const defaultFacetNames = [
  'TYPE',
  'REUSABILITY',
  'COUNTRY',
  'LANGUAGE',
  'PROVIDER',
  'DATA_PROVIDER',
  'IMAGE_ASPECTRATIO',
  'IMAGE_SIZE',
  'MIME_TYPE'
];

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
    dcTitle: display(item.dcTitleLangAware) || [],
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
 * @typedef {Object.<string, Array>} FilterSet
 */

/**
 * Extract applied filters from URL `qf` and `reusability` value(s)
 * @param {Object} query URL query parameters
 * @return {FilterSet} selected facets
 * TODO: move into /store/search.js?
 */
export function filtersFromQuery(query) {
  let filters = {};
  if (query.qf) {
    for (const qf of [].concat(query.qf)) {
      const qfParts = qf.split(':');
      const facetName = qfParts[0];
      const facetValue = qfParts[1].match(/^".*"$/) ? qfParts[1].slice(1, -1) : qfParts[1]; // Slice only if double quotes exist
      if (typeof filters[facetName] === 'undefined') {
        filters[facetName] = [];
      }
      filters[facetName].push(facetValue);
    }
  }
  if (query.reusability) {
    filters['REUSABILITY'] = query.reusability.split(',');
  }

  return filters;
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
  const perPage = params.rows === undefined ? 24 : Number(params.rows);
  const page = params.page || 1;
  const start = ((page - 1) * perPage) + 1;
  const rows = Math.max(0, Math.min(maxResults + 1 - start, perPage));

  const query = (typeof params.query === 'undefined' || params.query === '') ? '*:*' : params.query;

  return axios.get('https://api.europeana.eu/api/v2/search.json', {
    paramsSerializer(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
    params: {
      facet: params.facet ? params.facet : defaultFacetNames.join(','),
      profile: params.profile ? params.profile : 'minimal,facets',
      qf: qfHandler(params.qf),
      query,
      reusability: params.reusability,
      rows,
      start,
      theme: params.theme,
      wskey: params.wskey
    }
  })
    .then((response) => {
      return {
        error: null,
        results: resultsFromApiResponse(response),
        facets: response.data.facets || [],
        totalResults: response.data.totalResults,
        lastAvailablePage: start + perPage > maxResults
      };
    })
    .catch((error) => {
      throw apiError(error);
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
