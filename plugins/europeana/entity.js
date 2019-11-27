import { apiError } from './utils';
import axios from 'axios';

export const constants = Object.freeze({
  API_ORIGIN: 'https://api.europeana.eu',
  API_PATH_PREFIX: '/entity',
  API_ENDPOINT_SEARCH: '/search',
  API_ENDPOINT_SUGGEST: '/suggest',
  URI_ORIGIN: 'http://data.europeana.eu'
});

/**
 * Get data for one entity from the API
 * @param {string} type the type of the entity, will be normalized to the EntityAPI type if it's a human readable type
 * @param {string} id the id of the entity (can contain trailing slug parts as these will be normalized)
 * @param {Object} params additional parameters sent to the API
 * @param {string} params.wskey API key
 * @return {Object[]} parsed entity data
 */
export function getEntity(type, id, params) {
  return axios.get(getEntityUrl(type, id), {
    params: {
      wskey: params.wskey
    }
  })
    .then((response) => {
      return {
        error: null,
        entity: response.data
      };
    })
    .catch((error) => {
      throw apiError(error);
    });
}

function entityApiUrl(endpoint) {
  return `${constants.API_ORIGIN}${constants.API_PATH_PREFIX}${endpoint}`;
}

import search from './search';

/**
 * Get entity suggestions from the API
 * @param {string} text the query text to supply suggestions for
 * @param {Object} params additional parameters sent to the API
 * @param {string} params.language language(s), comma-separated, to request
 * @param {string} params.wskey API key
 * @param {Object} options optional settings
 * @param {boolean} options.recordValidation if `true`, filter suggestions to those with record matches
 * @return {Object[]} entity suggestions from the API
 */
export function getEntitySuggestions(text, params = {}, options = {}) {
  return axios.get(entityApiUrl(constants.API_ENDPOINT_SUGGEST), {
    params: {
      text,
      type: 'agent,concept',
      language: params.language,
      scope: 'europeana',
      wskey: params.wskey
    }
  })
    .then((response) => {
      if (!response.data.items) return [];
      return options.recordValidation ? filterSuggestionsByRecordValidation(response.data.items) : response.data.items;
    })
    .catch((error) => {
      throw apiError(error);
    });
}

function filterSuggestionsByRecordValidation(suggestions) {
  const searches = suggestions.map((entity) => {
    return search({
      query: getEntityQuery(entity.id),
      rows: 0,
      profile: 'minimal',
      qf: ['contentTier:(2 OR 3 OR 4)'],
      wskey: process.env.EUROPEANA_API_KEY
    });
  });

  return axios.all(searches)
    .then(axios.spread(function() {
      const searchResponses = arguments;
      return suggestions.filter((entity, index) => {
        return searchResponses[index].totalResults > 0;
      });
    }));
}

/**
 * Retrieve the API name of the type using the human readable name
 * @param {string} type the type of the entity
 * @return {string} retrieved API name of type
 */
function getEntityTypeApi(type) {
  const names = {
    person: 'agent',
    topic: 'concept'
  };
  if (!type) return;
  return names[type];
}

/**
 * Retrieve the human readable of the type using the API name
 * @param {string} type the type of the entity
 * @return {string} retrieved human readable name of type
 */
export function getEntityTypeHumanReadable(type) {
  const names = {
    agent: 'person',
    concept: 'topic'
  };
  if (!type) return;
  return names[type.toLowerCase()];
}

/**
 * Retrieve the URI of the entity from the human readable type and ID
 * @param {string} type the human readable type of the entity either person or topic
 * @param {string} id the numeric identifier of the entity, (can contain trailing slug parts as these will be normalized)
 * @return {string} retrieved human readable name of type
 */
export function getEntityUri(type, id) {
  return `${constants.URI_ORIGIN}/${getEntityTypeApi(type)}/base/${normalizeEntityId(id)}`;
}

/**
 * Construct an entity-type-specific Record API query for an entity
 * @param {string} uri entity URI
 * @return {string} Record API query
 */
export function getEntityQuery(uri) {
  if (uri.includes('/concept/base/')) {
    return `skos_concept:"${uri}"`;
  } else if (uri.includes('/agent/base/')) {
    return `edm_agent:"${uri}"`;
  }
  return null;
}

/**
 * Retrieve the URL of the entity from the human readable type and ID
 * @param {string} type the human readable type of the entity either person or topic
 * @param {string} id the numeric identifier of the entity, (can contain trailing slug parts as these will be normalized)
 * @return {string} retrieved human readable name of type
 */
function getEntityUrl(type, id) {
  return entityApiUrl(`/${getEntityTypeApi(type)}/base/${normalizeEntityId(id)}.json`);
}

/**
 * Remove any additional data from the slug in order to retrieve the entity id.
 * @param {string} id the id of the entity
 * @return {string} retrieved id
 */
function normalizeEntityId(id) {
  if (!id) return;
  return id.split('-')[0];
}

/**
 * Retrieves the path for the entity, based on id and title
 *
 * If `entityPage.name` is present, that will be used in the slug. Otherwise
 * `prefLabel.en` if present.
 *
 * @param {Object} entity an entity object as retrieved from the entity API
 * @param {string} title the title of the entity
 * @param {Object} entityPage Contentful entry for the entity page, with all locales
 * @return {string} path
 * @example Slug based on `entityPage.name`
 *    const slug = getEntitySlug({
 *      id: 'http://data.europeana.eu/concept/base/48',
 *      prefLabel: { en: 'Photograph' }
 *    }, {
 *      name: 'Photography'
 *    });
 *    console.log(slug); // expected output: '48-photography'
 * @example Slug based on `entity.prefLabel.en`
 *    const slug = getEntitySlug({
 *      id: 'http://data.europeana.eu/agent/base/59832',
 *      prefLabel: { en: 'Vincent van Gogh' }
 *    });
 *    console.log(slug); // expected output: '59832-vincent-van-gogh'
 */
export function getEntitySlug(entity, entityPage) {
  const name = (entityPage && entityPage.name) ? entityPage.name : entity.prefLabel.en;
  const entityId = entity.id.toString().split('/').pop();
  const path = entityId + (name ? '-' + name.toLowerCase().replace(/ /g, '-') : '');
  return path;
}

/**
 * Search for specific facets for this entity to find the related entities
 * @param {string} type the type of the entity
 * @param {string} id the id of the entity, (can contain trailing slug parts as these will be normalized)
 * @param {Object} params additional parameters sent to the API
 * @return {Object} related entities
 * TODO: add people as related entities again
 */
export function relatedEntities(type, id, params) {
  const entityUri = getEntityUri(type, id);
  let apiParams = {
    wskey: params.wskey,
    profile: 'facets',
    facet: 'skos_concept',
    query: getEntityQuery(entityUri),
    rows: 0
  };

  return axios.get('https://api.europeana.eu/api/v2/search.json', {
    params: apiParams
  })
    .then((response) => {
      return response.data.facets ? getEntityFacets(response.data.facets, normalizeEntityId(id), params.entityKey) : [];
    })
    .catch((error) => {
      const message = error.response ? error.response.data.error : error.message;
      throw new Error(message);
    });
}

/**
 * Return the facets that include data.europeana.eu
 * @param {Object} facets the facets retrieved from the search
 * @param {String} currentId id of the current entity
 * @param {String} entityKey the key for the entity api
 * @return {Object} related entities
 * TODO: limit results
 */
async function getEntityFacets(facets, currentId, entityKey) {
  let entities = [];
  for (let facet of facets) {
    entities = entities.concat(facet['fields'].filter(value =>
      value['label'].includes(constants.URI_ORIGIN) && value['label'].split('/').pop() !== currentId
    ));
  }
  const entityUris = entities.slice(0, 4).map(entity => {
    return entity['label'];
  });
  return getRelatedEntityTitleLink(await searchEntities(entityUris, { wskey: entityKey }));
}

/**
 * Lookup data for the given list of entity URIs
 * @param {Array} entityUris the URIs of the entities to retrieve
 * @param {Object} params additional parameters sent to the API
 * @return {Object} entity data
 */
export function searchEntities(entityUris, params) {
  if (entityUris.length === 0) return;

  const q = entityUris.join('" OR "');
  return axios.get(entityApiUrl(constants.API_ENDPOINT_SEARCH), {
    params: {
      query: `entity_uri:("${q}")`,
      wskey: params.wskey
    }
  })
    .then((response) => {
      let items = response.data.items ? response.data.items : [];
      return items;
    })
    .catch((error) => {
      const message = error.response ? error.response.data.error : error.message;
      throw new Error(message);
    });
}

/**
 * Format the the entity data for a related entity
 * @param {Object} entities the data returned from the Entity API
 * @return {Object} entity links and titles
 */
function getRelatedEntityTitleLink(entities) {
  let entityDetails = [];

  for (let entity of entities) {
    if (entity.prefLabel.en) {
      entityDetails.push({
        type: getEntityTypeHumanReadable(entity.type),
        path: getEntitySlug(entity),
        // TODO: l10n
        title: entity.prefLabel.en
      });
    }
  }
  return entityDetails;
}

/**
 * Get the description for the entity
 * If type is topic, use note
 * If type is person, use biographicalInformation
 * @param {Object} entity data
 * @return {String} description when available in English
 * TODO: l10n
 */
export function getEntityDescription(entity) {
  if (!entity) return null;
  let description;
  if (entity.type === 'Concept' && entity.note) {
    description = entity.note.en ? entity.note.en[0] : '';
  } else if (entity.type === 'Agent' && entity.biographicalInformation) {
    // check if biographicalInformation is an array of objects
    // TODO: it _should_ always be an array. this is an Entity API bug. remove
    //       the condition when fixed upstream.
    //       see: https://europeana.atlassian.net/browse/EA-1685
    if (entity.biographicalInformation.length !== undefined) {
      description = entity.biographicalInformation.filter(info => info['@language'] === 'en')[0]['@value'];
    } else {
      description = entity.biographicalInformation['@language'] === 'en' ? entity.biographicalInformation['@value'] : '';
    }
  }
  return description;
}

/**
 * A check for a URI to see if it conforms ot the entity URI pattern,
 * optionally takes entity types as an array of values to check for.
 * Will return true/false
 * @param {string} uri A URI to check
 * @param {string[]} types the entity types to check, defaults to all.
 * @return {Boolean} true if the URI is a valid entity URI
 */
export function isEntityUri(uri, types) {
  types = types ? types : ['concept', 'agent', 'place'];
  return RegExp(`^http://data\\.europeana\\.eu/(${types.join('|')})/base/\\d+$`).test(uri);
}

/**
 * From a URI split params as required by the portal
 * @param {string} uri A URI to check
 * @return {{type: String, identifier: string}} Object with the portal relevant identifiers.
 */
export function entityParamsFromUri(uri) {
  const matched = uri.match(/^http:\/\/data\.europeana\.eu\/(concept|agent|place)\/base\/(\d+)$/);
  const id = matched[2];
  const type = getEntityTypeHumanReadable(matched[1]);
  return { id, type };
}

/**
 * The logic for going from: http://commons.wikimedia.org/wiki/Special:FilePath/[image] to
 * https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/[image]/200px-[image]:
 * @image {String} image URL of wikimedia image
 * @return {String} formatted thumbnail url
 */
export function getWikimediaThumbnailUrl(image) {
  const md5 = require('md5');

  const filename = image.split('/').pop();
  const suffix = filename.endsWith('.svg') ? '.png' : '';
  const underscoredFilename = decodeURIComponent(filename).replace(/ /g, '_');
  const hash = md5(underscoredFilename);

  return 'https://upload.wikimedia.org/wikipedia/commons/thumb/' +
      hash.substring(0, 1) + '/' + hash.substring(0, 2) + '/' +
      underscoredFilename + '/255px-' + underscoredFilename + suffix;
}
