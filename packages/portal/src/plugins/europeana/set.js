// TODO: move to static properties of class?
export const EUROPEANA_SET_VISIBILITY_PRIVATE = 'private';
export const EUROPEANA_SET_VISIBILITY_PUBLIC = 'public';
export const EUROPEANA_SET_VISIBILITY_PUBLISHED = 'published';

import EuropeanaApi from './apis/base.js';

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
    return this.search({ query: `creator:${creator} type:BookmarkFolder`, profile: 'items' })
      .then((response) => response.items?.[0] || null)
      .catch(error => {
        throw this.apiError(error);
      });
  }

  requestSet(id, options = {}) {
    const url = `/${id.split('/').pop()}${options.url || ''}`;

    return this.request({
      ...options,
      url
    });
  }

  /**
   * Get a set with given id
   * @param {string} id the set's id
   * @param {Object} params retrieval params
   * @param {string} params.profile the set's metadata profile minimal/standard/itemDescriptions
   * @param {string} params.page the set's page for item retrieval
   * @param {string} params.perPage the number of items per page of results
   * @return {Object} the set's object, containing the requested window of the set's items
   */
  get(id, params = {}) {
    return this.requestSet(id, {
      method: 'get',
      params: {
        profile: 'meta',
        ...params
      }
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
      visibility: EUROPEANA_SET_VISIBILITY_PRIVATE
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
    return this.requestSet(id, {
      method: 'put',
      data,
      params
    });
  }

  /**
   * Publish a set
   * @param {string} id the set's id
   * @return {Object} API response data
   */
  publish(id) {
    return this.requestSet(id, {
      method: 'put',
      url: '/publish'
    });
  }

  /**
   * Unpublish a set
   * @param {string} id the set's id
   * @return {Object} API response data
   */
  unpublish(id) {
    return this.requestSet(id, {
      method: 'put',
      url: '/unpublish'
    });
  }

  /**
   * Delete a set
   * @param {string} id the set's id
   * @return {Object} API response data
   */
  delete(id) {
    return this.requestSet(id, {
      method: 'delete'
    });
  }

  pinItem(setId, itemId) {
    return this.insertItems(setId, itemId, 'pin');
  }

  /**
   * Insert item(s) into a set
   * @param {string} setId the set's id
   * @param {string,array} itemIds the ID(s) of the item(s) to insert
   * @param {number,string} position the position at which to insert the item(s)
   * @return {Promise,Promise[]} API request(s)
   */
  async insertItems(setId, itemIds, position) {
    return this.requestSet(setId, {
      method: 'put',
      url: '/items',
      data: [].concat(itemIds),
      params: { position }
    });
  }

  /**
   * Delete item(s) from a set
   * @param {string} setId the set's id
   * @param {string,array} itemIds the ID(s) of the item(s) to delete
   * @return {Promise,Promise[]} API request(s)
   */
  async deleteItems(setId, itemIds) {
    return this.requestSet(setId, {
      method: 'delete',
      url: '/items',
      data: [].concat(itemIds)
    });
  }

  getItemIds(id, { page = 1, pageSize = 100 } = {}) {
    return this.get(id, {
      page,
      pageSize,
      profile: 'items'
    }).then((response) => response?.items);
  }

  getItems(id, { page = 1, pageSize = 100 } = {}) {
    return this.get(id, {
      page,
      pageSize,
      profile: 'items.meta'
    })
      .then((response) => response?.items)
      .catch((error) => {
        if (error.statusCode === 400 && error.response.data.message.includes('page : value out of range')) {
          return [];
        }
        throw error;
      });
  }

  repositionItem(setId, itemId, position) {
    return this.deleteItems(setId, itemId)
      .then(() => this.insertItems(setId, itemId, position));
  }

  searchItems(setId, itemIds) {
    return this.requestSet(setId, {
      method: 'get',
      url: '/search',
      params: {
        profile: 'items',
        qf: [].concat(itemIds).map((itemId) => `item:${itemId}`),
        query: '*'
      }
    });
  }
}
