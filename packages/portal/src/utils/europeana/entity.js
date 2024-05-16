import {
  EUROPEANA_DATA_API_BASE_URL,
  EUROPEANA_ENTITY_API_ENTITY_TYPES
} from '@europeana/apis';

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
 * @param {string|string[]} uri entity URI(s)
 * @return {string} Record API query
 */
export function getEntityQuery(uri) {
  if (Array.isArray(uri)) {
    return uri
      .filter((u) => isEntityUri(u))
      .map((u) => getEntityQuery(u))
      .join(' OR ');
  }

  const type = EUROPEANA_ENTITY_API_ENTITY_TYPES.find((type) => uri.includes(`/${type.id}/`));

  if (type) {
    return `${type.qf}:"${uri}"`;
  } else {
    throw new Error(`Unsupported entity URI "${uri}"`);
  }
}

/**
 * A check for a URI to see if it conforms to the entity URI pattern,
 * optionally takes entity types as an array of values to check for.
 * Will return true/false
 * @param {string} uri A URI to check
 * @return {Boolean} true if the URI is a valid entity URI
 */
export function isEntityUri(uri) {
  const types = EUROPEANA_ENTITY_API_ENTITY_TYPES.map((type) => type.id);
  return RegExp(`^${EUROPEANA_DATA_API_BASE_URL}/(${types.join('|')})/\\d+$`).test(uri);
}

/**
 * Retrieve the API name of the type using the human readable slug
 * @param {string} slug the entity slug, e.g. "topic"
 * @return {string} retrieved API name of type
 */
export function getEntityTypeApi(slug) {
  return EUROPEANA_ENTITY_API_ENTITY_TYPES.find((type) => type.slug === slug)?.id || null;
}

/**
 * Retrieve the human readable of the type using the API name
 * @param {string} id the id of the entity type, e.g. "concept"
 * @return {string} retrieved human readable name of type
 */
export function getEntityTypeHumanReadable(id) {
  return EUROPEANA_ENTITY_API_ENTITY_TYPES.find((type) => type.id === id.toLowerCase())?.slug || null;
}

/**
 * Retrieve the URI of the entity from the human readable type and ID
 * @param {string} type the human-readable type of the entity
 * @param {string} id the numeric identifier of the entity, (can contain trailing slug parts as these will be normalized)
 * @return {string} retrieved human readable name of type
 */
export function getEntityUri(type, id) {
  const apiType = getEntityTypeApi(type);
  return `${EUROPEANA_DATA_API_BASE_URL}/${apiType}/${normalizeEntityId(id)}`;
}

/**
 * From a URI split params as required by the portal
 * @param {string} uri A URI to check
 * @return {{type: String, identifier: string}} Object with the portal relevant identifiers.
 */
export function entityParamsFromUri(uri) {
  const matched = /^http:\/\/data\.europeana\.eu\/(concept|agent|place|timespan|organization)\/(\d+)$/.exec(uri);
  const id = matched[matched.length - 1];
  const type = getEntityTypeHumanReadable(matched[1]);
  return { id, type };
}
