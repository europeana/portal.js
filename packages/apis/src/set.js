import EuropeanaApi from './base.js';

export const EUROPEANA_SET_API_VISIBILITY_PRIVATE = 'private';
export const EUROPEANA_SET_API_VISIBILITY_PUBLIC = 'public';
export const EUROPEANA_SET_API_VISIBILITY_PUBLISHED = 'published';

const setIdFromUri = (uri) => uri.split('/').pop();

export default class EuropeanaSetApi extends EuropeanaApi {
  static ID = 'set';
  static BASE_URL = 'https://api.europeana.eu/set';
  static AUTHENTICATING = true;
  static AUTHORISING = true;

  /**
   * Search for user sets
   * @param {Object} params retrieval params to send to Set API search method
   */
  search(params) {
    return this.request({
      method: 'get',
      url: '/search',
      params
    });
  }

  /**
   * Get the user's set with type BookmarkFolder
   * @param {string} creator the creator's id
   * @return {string} the id of the set
   */
  getLikes(creator) {
    return this.search({ query: `creator:${creator} type:BookmarkFolder` })
      .then((response) => response.items?.[0] || null);
  }

  /**
   * Get a set with given id
   * @param {string} id the set's id
   * @param {Object} params retrieval params
   * @param {string} params.profile the set's metadata profile minimal/standard/itemDescriptions
   * @return {Object} the set's object, containing the requested window of the set's items
   */
  // TODO: pagination for sets with > 100 items
  async get(id, params = {}) {
    const defaults = {
      profile: 'standard'
    };
    const paramsWithDefaults = { ...defaults, ...params };

    return this.request({
      method: 'get',
      url: `/${setIdFromUri(id)}`,
      params: paramsWithDefaults
    });
  }

  /**
   * Create a set of type BookmarkFolder with a fixed title
   * @return {Object} API response data
   */
  createLikes() {
    return this.create({
      type: 'BookmarkFolder',
      title: {
        en: 'LIKES'
      },
      visibility: EUROPEANA_SET_API_VISIBILITY_PRIVATE
    });
  }

  /**
   * Create a set
   * @param {Object} data Set body
   * @return {Object} API response data
   */
  create(data) {
    return this.request({
      method: 'post',
      url: '/',
      data
    });
  }

  /**
   * Update a set
   * @param {string} id the set's id
   * @param {Object} data Set body
   * @return {Object} API response data
   */
  update(id, data, params = {}) {
    return this.request({
      method: 'put',
      url: `/${setIdFromUri(id)}`,
      data,
      params
    });
  }

  /**
   * Publish a set
   * @param {string} id the set's id
   * @return {Object} API response data
   */
  publish(id = '') {
    return this.request({
      method: 'put',
      url: `/${setIdFromUri(id)}/publish`
    });
  }

  /**
   * Unpublish a set
   * @param {string} id the set's id
   * @return {Object} API response data
   */
  unpublish(id = '') {
    return this.request({
      method: 'put',
      url: `/${setIdFromUri(id)}/unpublish`
    });
  }

  /**
   * Delete a set
   * @param {string} id the set's id
   * @return {Object} API response data
   */
  delete(id) {
    return this.request({
      method: 'delete',
      url: `/${setIdFromUri(id)}`
    });
  }

  /**
   * Modify the set items by adding or deleting an item
   * @param {string} action the type of modification, can be either 'add' or 'delete'
   * @param {string} setId the id of the set that will be modified
   * @param {string} itemId the id of the item to be added or deleted, with leading slash
   * @param {Boolean} pin if true will indicate that the item is to be pinned
   * @return {Object} API response data
   */
  async modifyItems(action, setId, itemId, pin) {
    const method = (action === 'add') ? 'put' : 'delete';
    const pinPos = pin ? '?position=pin' : '';

    return this.request({
      method,
      url: `/${setIdFromUri(setId)}${itemId}${pinPos}`
    });
  }
}
