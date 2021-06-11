require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.EUROPEANA_ENTITY_API_URL || 'https://api.europeana.eu/entity';
const EUROPEANA_API_KEY = process.env.EUROPEANA_ENTITY_API_KEY || process.env.EUROPEANA_API_KEY;

const $axios = axios.create({ id: 'entity',
  baseURL: BASE_URL,
  params: {
    wskey: EUROPEANA_API_KEY
  } });

function searchEntities(page) {
  return $axios.get('/search', {
    params: {
      ...$axios.defaults.params,
      query: '*:*',
      type: 'organization',
      page,
      pageSize: 100
    }
  })
    .then((response) => {
      const organizations = [];
      response.data.items.forEach(organization => {
        // add or remove desired fields
        const strippedOrganization = {
          id: organization.id,
          identifier: organization.identifier,
          prefLabel: organization.prefLabel,
          ...organization.homepage && { homepage: organization.homepage }
        };
        organizations.push(strippedOrganization);
      }
      );

      console.log(JSON.stringify(organizations));
      totalOrganistations = response.data.partOf.total; // set the actual total of organisations for the looped request
    })
    .catch((error) => {
      const message = error.response ? error.response.data.error : error.message;
      throw new Error(message);
    });
}

let pageNumber = 0;
let totalOrganistations = 3000;
// the API allows 100 entities per request. Loop until all organisations are retrieved.
while (pageNumber < Math.ceil(totalOrganistations / 100)) {
  searchEntities(pageNumber);
  pageNumber = pageNumber + 1;
}
