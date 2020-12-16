import axios from 'axios';

import { BASE_URL as EUROPEANA_DATA_URL } from './data';
import { apiError } from './utils';

export const BASE_URL = process.env.EUROPEANA_ENTITY_API_URL || 'https://api.europeana.eu/entity';
export const axiosDefaults = {
  baseURL: BASE_URL,
  params: {
    wskey: process.env.EUROPEANA_ENTITY_API_KEY || process.env.EUROPEANA_API_KEY
  }
};

export default (axiosOverrides) => {
  return {
    $axios: axios.create({
      ...axiosDefaults,
      ...axiosOverrides
    }),

    /**
     * Get data for one entity from the API
     * @param {string} type the type of the entity, will be normalized to the EntityAPI type if it's a human readable type
     * @param {string} id the id of the entity (can contain trailing slug parts as these will be normalized)
     * @return {Object[]} parsed entity data
     */
    getEntity(type, id) {
      return this.$axios.get(getEntityUrl(type, id))
        .then(response => ({
          error: null,
          entity: response.data
        }))
        .catch(error => {
          throw apiError(error);
        });
    },

    /**
     * Get entity suggestions from the API
     * @param {string} text the query text to supply suggestions for
     * @param {Object} params additional parameters sent to the API
     * @param {string} params.language language(s), comma-separated, to request
     */
    getEntitySuggestions(text, params = {}) {
      return this.$axios.get('/suggest', {
        params: {
          ...this.$axios.defaults.params,
          ...params,
          text,
          type: 'agent,concept,timespan',
          scope: 'europeana'
        }
      })
        .then(response => response.data.items ? response.data.items : [])
        .catch(error => {
          throw apiError(error);
        });
    },

    /**
     * Return the facets that include data.europeana.eu
     * @param {Object} facets the facets retrieved from the search
     * @param {String} id id of the current entity
     * @return {Object} related entities
     * TODO: limit results
     */
    async getEntityFacets(facets, id) {
      const currentId = normalizeEntityId(id);
      let entities = [];
      for (const facet of facets) {
        const facetFilter = (value) => value['label'].includes(EUROPEANA_DATA_URL) && value['label'].split('/').pop() !== currentId;
        entities = entities.concat(facet['fields'].filter(facetFilter));
      }

      const entityUris = entities.slice(0, 4).map(entity => {
        return entity['label'];
      });
      return getRelatedEntityData(await this.findEntities(entityUris));
    },

    /**
     * Lookup data for the given list of entity URIs
     * @param {Array} entityUris the URIs of the entities to retrieve
     * @return {Object} entity data
     */
    findEntities(entityUris) {
      if (entityUris.length === 0) return;
      const q = entityUris.join('" OR "');
      const params = {
        query: `entity_uri:("${q}")`
      };
      return this.searchEntities(params)
        .then((response) => {
          return response.entities || [];
        });
    },

    /**
     * Return all entity subjects of type concept / agent / timespan
     * @param {Object} params additional parameters sent to the API
     */
    searchEntities(params = {}) {
      return this.$axios.get('/search', {
        params: {
          ...this.$axios.defaults.params,
          ...params
        }
      })
        .then((response) => {
          return {
            entities: response.data.items ? response.data.items : [],
            total: response.data.partOf ? response.data.partOf.total : null
          };
        })
        .catch((error) => {
          throw apiError(error);
        });
    }
  };
};

/**
 * Format the the entity data for a related entity
 * @param {Object} entities the data returned from the Entity API
 * @return {Object[]} entity data
 */
function getRelatedEntityData(entities) {
  let entityDetails = [];
  for (let entity of entities || []) {
    if (entity.prefLabel.en) {
      entityDetails.push(entity);
    }
  }
  return entityDetails;
}

/**
 * Remove any additional data from the slug in order to retrieve the entity id.
 * @param {string} id the id of the entity
 * @return {string} retrieved id
 */
export function normalizeEntityId(id) {
  if (!id) return;
  return id.split('-')[0];
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
  } else if (uri.includes('/timespan/')) {
    return `edm_timespan:"${uri}"`;
  }
  return null;
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
  types = types ? types : ['concept', 'agent', 'place', 'timespan'];
  return RegExp(`^http://data\\.europeana\\.eu/(${types.join('|')})/base/\\d+$`).test(uri);
}

/**
 * Retrieve the API name of the type using the human readable name
 * @param {string} type the type of the entity
 * @return {string} retrieved API name of type
 */
export function getEntityTypeApi(type) {
  const names = {
    person: 'agent',
    topic: 'concept',
    time: 'timespan'
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
    concept: 'topic',
    timespan: 'times'
  };
  if (!type) return;
  return names[type.toLowerCase()];
}

/**
 * Retrieve the URL of the entity from the human readable type and ID
 * @param {string} type the human readable type of the entity either person or topic
 * @param {string} id the numeric identifier of the entity, (can contain trailing slug parts as these will be normalized)
 * @return {string} retrieved human readable name of type
 */
function getEntityUrl(type, id) {
  return `/${getEntityTypeApi(type)}/base/${normalizeEntityId(id)}.json`;
}

/**
 * Retrieve the URI of the entity from the human readable type and ID
 * @param {string} type the human readable type of the entity either person or topic
 * @param {string} id the numeric identifier of the entity, (can contain trailing slug parts as these will be normalized)
 * @return {string} retrieved human readable name of type
 */
export function getEntityUri(type, id) {
  return `${EUROPEANA_DATA_URL}/${getEntityTypeApi(type)}/base/${normalizeEntityId(id)}`;
}

/**
 * From a URI split params as required by the portal
 * @param {string} uri A URI to check
 * @return {{type: String, identifier: string}} Object with the portal relevant identifiers.
 */
export function entityParamsFromUri(uri) {
  const matched = uri.match(/^http:\/\/data\.europeana\.eu\/(concept|agent|place|timespan)\/base\/(\d+)$/);
  const id = matched[2];
  const type = getEntityTypeHumanReadable(matched[1]);
  return { id, type };
}

/**
 * Retrieves the path for the entity, based on id and title
 *
 * If `entityPage.name` is present, that will be used in the slug. Otherwise
 * `prefLabel.en` if present.
 *
 * @param {string} id entity ID, i.e. data.europeana.eu URI
 * @param {string} name the English name of the entity
 * @return {string} path
 * @example
 *    const slug = getEntitySlug(
 *      'http://data.europeana.eu/concept/base/48',
 *      'Photography'
 *    );
 *    console.log(slug); // expected output: '48-photography'
 * @example
 *    const slug = getEntitySlug(
 *      'http://data.europeana.eu/agent/base/59832',
 *      'Vincent van Gogh'
 *    );
 *    console.log(slug); // expected output: '59832-vincent-van-gogh'
 */
export function getEntitySlug(id, name) {
  const entityId = id.toString().split('/').pop();
  const path = entityId + (name ? '-' + name.toLowerCase().replace(/ /g, '-') : '');
  return path;
}
