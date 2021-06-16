const axios = require('axios');

const BASE_URL = process.env.EUROPEANA_ENTITY_API_URL || 'https://api.europeana.eu/entity';
const EUROPEANA_API_KEY = process.env.EUROPEANA_ENTITY_API_KEY || process.env.EUROPEANA_API_KEY;

const $axios = axios.create({ id: 'entity',
  baseURL: BASE_URL,
  params: {
    wskey: EUROPEANA_API_KEY
  } });

const searchEntities = (page) => {
  return $axios.get('/search', {
    params: {
      ...$axios.defaults.params,
      query: '*:*',
      type: 'organization',
      page,
      pageSize: 100
    }
  })
    .then(response => {
      return response.data.total === 0 ? [] : response.data.items.map(({ identifier, prefLabel }) => {
        // add or remove desired fields
        return {
          identifier,
          prefLabel
        };
      });
    })
    .catch(error => {
      const message = error.response ? error.response.data.error : error.message;
      throw new Error(message);
    });
};

const main = async() => {
  let organizations = [];
  let page = 0;
  let pageOfOrganizations;

  // the API allows 100 entities per request. Loop until all organisations are retrieved.
  while (!Array.isArray(pageOfOrganizations) || pageOfOrganizations.length > 0) {
    // console.log(`Page ${page}`);
    pageOfOrganizations = await searchEntities(page);
    organizations = organizations.concat(pageOfOrganizations);
    page = page + 1;
  }

  const orgs = organizations.reduce((memo, { identifier, prefLabel }) => {
    memo[identifier[0]] = { prefLabel };
    return memo;
  }, {});

  console.log(JSON.stringify(orgs, null, 2));
};

module.exports = {
  main
};
