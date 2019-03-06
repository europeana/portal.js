import axios from 'axios';

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
    dcTitle: item.dcTitleLangAware ? display(item.dcTitleLangAware) : `No title provided for record ID ${item.id}`,
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
      linkTo: `record${item.id}`,
      fields: fieldsForSearchResult(item)
    };
  });

  return results;
}

/**
 * Search Europeana Record API
 * @param {Object} params parameters for search query
 * @param {string} params.query search query
 * @param {string} params.wskey API key
 * @return {{results: Object[], totalResults: number, error: string}} search results for display
 */
function search(params) {
  return axios.get('https://api.europeana.eu/api/v2/search.json', {
    params: {
      profile: 'minimal',
      query: params.query == '' ? '*:*' : params.query,
      rows: 24,
      wskey: params.wskey
    }
  })
    .then((response) => {
      return {
        error: null,
        results: resultsFromApiResponse(response),
        totalResults: response.data.totalResults
      };
    })
    .catch((error) => {
      const message = error.response ? error.response.data.error : error.message;
      throw new Error(message);
    });
}

export default search;
