require('dotenv').config();
const axios = require('axios');
const redis = require('redis');

const BASE_URL = process.env.EUROPEANA_ENTITY_API_URL || 'https://api.europeana.eu/entity';
const EUROPEANA_API_KEY = process.env.EUROPEANA_ENTITY_API_KEY || process.env.EUROPEANA_API_KEY;

const axiosConfig = { id: 'entity',
  baseURL: BASE_URL,
  params: {
    wskey: EUROPEANA_API_KEY
  } };

const redisConfig = () => {
  const redisOptions = {};

  if (process.env.REDIS_URL) {
    console.log(process.env.REDIS_URL);
    redisOptions.url = process.env.REDIS_URL;

    // is tls cert required?
    if (process.env.REDIS_TLS_CA) {
      redisOptions.tls = {
        ca: [Buffer.from(process.env.REDIS_TLS_CA, 'base64')]
      };
    }
  }

  return redisOptions;
};

const $axios = axios.create(axiosConfig);
const client = redis.createClient(redisConfig());
const perPage = 100;

function getEntitySearchPage(page) {
  return $axios.get('/search', {
    params: {
      ...$axios.defaults.params,
      query: '*:*',
      type: 'organization',
      page,
      pageSize: perPage
    }
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      const message = error.response ? error.response.data.error : error.message;
      throw new Error(message);
    });
}

function isLastPage(page, total) {
  if (!total) {
    return false;
  }
  return (page + 1 === Math.ceil(total / perPage));
}

function persistableFields(organisation) {
  return {
    id: organisation.id,
    prefLabel: organisation.prefLabel,
    ...organisation.homepage && { homepage: organisation.homepage }
  };
}
// function stringifyOrganisation(organisation) {
//   return JSON.stringify(organisation);
// }

async function run() {
  let page = 0;
  let total;
  const organisations = [];
  while (!isLastPage(page, total)) {
    const searchResults = await getEntitySearchPage(page);
    if (!total) {
      total = searchResults.partOf.total;
    }
    organisations.push(...searchResults.items.map((organisation) => {
      return persistableFields(organisation);
    }));
    console.log(`got page ${page}`);
    page += 1;
  }
  if (organisations && organisations.length > 1) {
    console.log('writing to redis');
    // client.hmset('organisations', organisations.map((org) => {
    //   return stringifyOrganisation(org);
    // }));
    // client.set('organisations', stringifyOrganisation(organisations));
    client.sadd('organisations', organisations);
  }
  return 'success';
}

run();
