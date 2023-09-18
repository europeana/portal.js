import md5 from 'md5';

import EuropeanaApi from './apis/base.js';
import { BASE_URL as EUROPEANA_DATA_URL } from './data.js';

export default class EuropeanaEntityApi extends EuropeanaApi {
  static ID = 'entity';
  static BASE_URL = 'https://api.europeana.eu/entity';
  static AUTHENTICATING = true;

  /**
   * Get data for one entity from the API
   * @param {string} type the type of the entity, will be normalized to the EntityAPI type if it's a human readable type
   * @param {string} id the id of the entity (can contain trailing slug parts as these will be normalized)
   * @return {Object[]} parsed entity data
   */
  get(type, id) {
    return this.axios.get(getEntityUrl(type, id))
      .then(response => ({
        error: null,
        entity: response.data
      }))
      .catch(error => {
        throw this.apiError(error);
      });
  }

  /**
   * Get entity suggestions from the API
   * @param {string} text the query text to supply suggestions for
   * @param {Object} params additional parameters sent to the API
   */
  suggest(text, params = {}) {
    return this.axios.get('/suggest', {
      params: {
        ...this.axios.defaults.params,
        text,
        type: 'agent,concept,timespan,organization,place',
        scope: 'europeana',
        ...params
      }
    })
      .then(response => response.data.items ? response.data.items : [])
      .catch(error => {
        throw this.apiError(error);
      });
  }

  /**
   * Lookup data for the given list of entity URIs
   * @param {Array} entityUris the URIs of the entities to retrieve
   * @param {Object} params additional parameters sent to the API
   * @return {Array} entity data
   */
  async find(entityUris, params = {}) {
    if (entityUris?.length === 0) {
      return Promise.resolve([]);
    }
    const q = entityUris.join('" OR "');
    const searchParams = {
      ...params,
      query: `entity_uri:("${q}")`,
      pageSize: entityUris.length
    };

    const response = await this.search(searchParams);

    return (response.entities || [])
      // Preserve original order from arg
      .sort((a, b) => {
        const indexForA = entityUris.findIndex((uri) => a.id === uri);
        const indexForB = entityUris.findIndex((uri) => b.id === uri);
        return indexForA - indexForB;
      });
  }

  /**
   * Return all entity subjects of type concept / agent / timespan
   * @param {Object} params additional parameters sent to the API
   */
  search(params = {}) {
    return this.axios.get('/search', {
      params: {
        ...this.axios.defaults.params,
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
        throw this.apiError(error);
      });
  }

  imageUrl(entity) {
    let url = null;
    // `image` is a property on automated entity cards in Contentful
    if (entity?.image) {
      url = this.context?.$apis?.thumbnail?.edmPreview(entity.image, { size: 200 });
    // `isShownBy` is a property on most entity types
    } else if (entity?.isShownBy?.thumbnail) {
      url = this.context?.$apis?.thumbnail?.edmPreview(entity.isShownBy.thumbnail, { size: 200 });
    // `logo` is a property on organization-type entities
    } else if (entity?.logo?.id) {
      url = getWikimediaThumbnailUrl(entity.logo.id, 28);
    }

    return url;
  }
}

/**
 * Remove any additional data from the slug in order to retrieve the entity id.
 * @param {string} id the id of the entity
 * @return {string} retrieved id
 */
export function normalizeEntityId(id) {
  return id ? id.split('-')[0] : null;
}

/**
 * Construct an entity-type-specific Record API query for an entity
 * @param {string} uri entity URI
 * @return {string} Record API query
 */
export function getEntityQuery(uri) {
  let entityQuery;

  if (uri.includes('/concept/')) {
    entityQuery = `skos_concept:"${uri}"`;
  } else if (uri.includes('/agent/')) {
    entityQuery = `edm_agent:"${uri}"`;
  } else if (uri.includes('/timespan/')) {
    entityQuery = `edm_timespan:"${uri}"`;
  } else if (uri.includes('/organization/')) {
    entityQuery = `foaf_organization:"${uri}"`;
  } else if (uri.includes('/place/')) {
    entityQuery = `edm_place:"${uri}"`;
  } else {
    throw new Error(`Unsupported entity URI "${uri}"`);
  }

  return entityQuery;
}

/**
 * A check for a URI to see if it conforms to the entity URI pattern,
 * optionally takes entity types as an array of values to check for.
 * Will return true/false
 * @param {string} uri A URI to check
 * @param {string[]} types the entity types to check, defaults to all.
 * @return {Boolean} true if the URI is a valid entity URI
 */
export function isEntityUri(uri, types) {
  types = types ? types : ['concept', 'agent', 'place', 'timespan', 'organization'];
  return RegExp(`^http://data\\.europeana\\.eu/(${types.join('|')})/\\d+$`).test(uri);
}

/**
 * Retrieve the API name of the type using the human readable name
 * @param {string} type the type of the entity
 * @return {string} retrieved API name of type
 */
export function getEntityTypeApi(type) {
  const names = {
    place: 'place',
    person: 'agent',
    topic: 'concept',
    time: 'timespan',
    organisation: 'organization'
  };
  return type ? names[type] : null;
}

/**
 * Retrieve the human readable of the type using the API name
 * @param {string} type the type of the entity
 * @return {string} retrieved human readable name of type
 */
export function getEntityTypeHumanReadable(type) {
  const names = {
    place: 'place',
    agent: 'person',
    concept: 'topic',
    timespan: 'time',
    organization: 'organisation'
  };
  return type ? names[type.toLowerCase()] : null;
}

/**
 * Retrieve the URL of the entity from the human readable type and ID
 * @param {string} type the human readable type of the entity either person or topic
 * @param {string} id the numeric identifier of the entity, (can contain trailing slug parts as these will be normalized)
 * @return {string} retrieved human readable name of type
 */
export function getEntityUrl(type, id) {
  return `/${getEntityTypeApi(type)}/${normalizeEntityId(id)}.json`;
}

/**
 * Retrieve the URI of the entity from the human readable type and ID
 * @param {string} type the human-readable type of the entity
 * @param {string} id the numeric identifier of the entity, (can contain trailing slug parts as these will be normalized)
 * @return {string} retrieved human readable name of type
 */
export function getEntityUri(type, id) {
  const apiType = getEntityTypeApi(type);
  return `${EUROPEANA_DATA_URL}/${apiType}/${normalizeEntityId(id)}`;
}

/**
 * From a URI split params as required by the portal
 * @param {string} uri A URI to check
 * @return {{type: String, identifier: string}} Object with the portal relevant identifiers.
 */
export function entityParamsFromUri(uri) {
  const matched = uri.match(/^http:\/\/data\.europeana\.eu\/(concept|agent|place|timespan|organization)\/(\d+)$/);
  const id = matched[matched.length - 1];
  const type = getEntityTypeHumanReadable(matched[1]);
  return { id, type };
}

/**
 * The logic for going from: http://commons.wikimedia.org/wiki/Special:FilePath/[image] to
 * https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/[image]/200px-[image]:
 * @image {String} image URL of wikimedia image
 * @size {Number} requested size of the image, default 255
 * @return {String} formatted thumbnail url
 */
export function getWikimediaThumbnailUrl(image, size = 255) {
  if (!(new RegExp('.wiki[mp]edia.org/wiki/Special:FilePath/').test(image))) {
    return image;
  }

  const filename = image.split('/').pop();
  const suffix = filename.endsWith('.svg') ? '.png' : '';
  const underscoredFilename = decodeURIComponent(filename).replace(/ /g, '_');
  const hash = md5(underscoredFilename);

  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash.substring(0, 1)}/${hash.substring(0, 2)}/${underscoredFilename}/${size}px-${underscoredFilename}${suffix}`;
}
