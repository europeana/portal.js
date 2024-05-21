import EuropeanaApi from '../base.js';

export const EUROPEANA_ENTITY_API_BASE_URL = 'https://api.europeana.eu/entity';
export const EUROPEANA_ENTITY_API_ENTITY_TYPES = [
  { id: 'agent', qf: 'edm_agent', slug: 'person' },
  { id: 'concept', qf: 'skos_concept', slug: 'topic' },
  { id: 'organization', qf: 'foaf_organization', slug: 'organisation' },
  { id: 'place', qf: 'edm_place', slug: 'place' },
  { id: 'timespan', qf: 'edm_timespan', slug: 'time' }
];

export default class EuropeanaEntityApi extends EuropeanaApi {
  static ID = 'entity';
  static BASE_URL = EUROPEANA_ENTITY_API_BASE_URL;
  static AUTHENTICATING = true;

  /**
   * Get data for one entity from the API
   * @param {string} type the type of the entity
   * @param {string|number} id the id of the entity
   * @return {Object[]} parsed entity data
   */
  get(type, id) {
    return this.request({
      method: 'get',
      url: `/${type}/${id}.json`
    });
  }

  /**
   * Get entity suggestions from the API
   * @param {string} text the query text to supply suggestions for
   * @param {Object} params additional parameters sent to the API
   */
  suggest(text, params = {}) {
    return this.request({
      method: 'get',
      url: '/suggest',
      params: {
        text,
        type: 'agent,concept,timespan,organization,place',
        scope: 'europeana',
        ...params
      }
    })
      .then((response) => response.items || []);
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

    const entities = await this.retrieve(entityUris, params);

    return (entities || [])
      // Preserve original order from arg
      .sort((a, b) => {
        const indexForA = entityUris.findIndex((uri) => a.id === uri);
        const indexForB = entityUris.findIndex((uri) => b.id === uri);
        return indexForA - indexForB;
      });
  }

  retrieve(entityUris, params = {}) {
    return this.request({
      method: 'post',
      url: '/retrieve',
      data: entityUris,
      params
    })
      .then((response) => response.items);
  }

  /**
   * Return all entity subjects of type concept / agent / timespan
   * @param {Object} params additional parameters sent to the API
   */
  search(params = {}) {
    return this.request({
      method: 'get',
      url: '/search',
      params
    });
  }
}
