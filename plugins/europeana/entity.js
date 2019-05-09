import axios from 'axios';

/**
 * Get the entity data from the API
 * @param {string} type the type of the entity
 * @param {string} id the id of the entity
 * @param {Object} params additional parameters sent to the API
 * @param {string} params.wskey API key
 * @return {Object[]} parsed entity data
 */
function getEntity(type, id, params) {
  return axios.get(`https://www.europeana.eu/api/entities/${getEntityTypeApi(type)}/base/${getEntityId(id)}`, {
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
      const message = error.response ? error.response.data.error : error.message;
      throw new Error(message);
    });
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
function getEntityTypeHumanReadable(type) {
  const names = {
    agent: 'person',
    concept: 'topic'
  };
  if (!type) return;
  return names[type.toLowerCase()];
}

/**
 * Retrieve the entity id from the slug
 * @param {string} url the url of the entity
 * @return {string} retrieved id
 */
function getEntityId(url) {
  if (!url) return;
  return url.split('-')[0];
}

/**
 * Retrieves the path for the entity, based on id and title
 * @param {string} id the id of the entity
 * @param {string} title the title of the entity
 * @return {string} path
 */
export function getEntityPath(id, title) {
  const entityId = id.split('-')[0];
  const path = entityId + (title ? '-' + title.toLowerCase().replace(/ /g, '-') : '');
  return path;
}

/**
 * Search for specific facets for this entity to find the related entities
 * @param {string} type the type of the entity
 * @param {string} id the id of the entity
 * @param {Object} params additional parameters sent to the API
 * @return {Object} related entities
 */
export function relatedEntities(type, id, params) {
  return axios.get('https://api.europeana.eu/api/v2/search.json', {
    params: {
      wskey: params.wskey,
      profile: 'facets',
      facet: 'edm_agent,skos_concept',
      query: `"http://data.europeana.eu/${getEntityTypeApi(type)}/base/${getEntityId(id)}"`,
      rows: 0
    }
  })
    .then((response) => {
      return response.data.facets ? getEntityFacets(response.data.facets, getEntityId(id), params.entityKey) : [];
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
function getEntityFacets(facets, currentId, entityKey) {
  let entities = [];
  for (let facet of facets) {
    entities = entities.concat(facet['fields'].filter(value => value['label'].includes('http://data.europeana.eu') && value['label'].split('/').pop() !== currentId));
  }
  return getDataForEntities(entities, entityKey);
}

/**
 * Lookup data for the given list of entity URIs
 * @param {Object} entities the entities retrieved from the facet search
 * @param {String} entityKey the key for the entity api
 * @return {Object} looked up entities data
 */
function getDataForEntities(entities, entityKey) {
  if (entities.length === 0) return;

  let entityLabels = entities.map(entity => {
    return entity['label'];
  });

  const q = entityLabels.join('"+OR+"');
  return axios.get(`https://www.europeana.eu/api/entities/search?query=entity_uri:("${q}")`, {
    params: {
      wskey: entityKey
    }
  })
    .then((response) => {
      return getRelatedEntityTitleLink(response.data.items.slice(0,10));
    })
    .catch((error) => {
      const message = error.response ? error.response.data.error : error.message;
      throw new Error(message);
    });
}

/**
 * Format the the entity data
 * @param {Object} entities the lookuped data for entities
 * @return {Object} entity links and titles
 */
function getRelatedEntityTitleLink(entities) {
  let entityDetails = [];

  for (let entity of entities) {
    if (entity.prefLabel.en) {
      entityDetails.push({ type: getEntityTypeHumanReadable(entity.type), path: getEntityPath(entity.id.toString().split('/').pop(), entity.prefLabel.en), title: entity.prefLabel.en });
    }
  }

  return entityDetails;
}

export default getEntity;
