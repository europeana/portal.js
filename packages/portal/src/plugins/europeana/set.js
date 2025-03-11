import { ITEM_URL_PREFIX as EUROPEANA_DATA_URL_ITEM_PREFIX } from './data.js';

// TODO: move to static properties of class?
export const EUROPEANA_SET_VISIBILITY_PRIVATE = 'private';
export const EUROPEANA_SET_VISIBILITY_PUBLIC = 'public';
export const EUROPEANA_SET_VISIBILITY_PUBLISHED = 'published';

const setIdFromUri = (uri) => uri.split('/').pop();

import EuropeanaApi from './apis/base.js';

export default class EuropeanaSetApi extends EuropeanaApi {
  static ID = 'set';
  static BASE_URL = 'https://api.europeana.eu/set';
  static AUTHENTICATING = true;
  static AUTHORISING = true;

  /**
   * Search for user sets
   * @param {Object} params retrieval params to send to Set API search method
   * @param {Object} options retrieval options
   * @param {Boolean} options.withMinimalItemPreviews retrieve minimal item metadata from Record API for first item in each set
   */
  async search(params, options = {}) {
    // TODO: rm when new version is in production
    if (this.config.version === '0.12') {
      // account for early versions of the API paginating from 0, new version from 1
      if (params.page) {
        params.page = params.page - 1;
      }
      if (params.profile === 'items.meta') {
        // account for early versions of the API response not including first set item preview/thumbnail
        if (options.withMinimalItemPreviews) {
          params.profile = 'standard';
        } else {
          params.profile = 'itemDescriptions';
        }
      }
      if (params.profile === 'items') {
        params.profile = 'minimal';
      }
    }

    const response = await this.request({
      method: 'get',
      url: '/search',
      params
    });

    // TODO: remove withMinimalItemPreviews option (also in component requests) when set API version is set to new
    if (this.config.version === '0.12' && options.withMinimalItemPreviews && response.items) {
      const itemUris = response.items.filter((set) => set.items).map((set) => set.items[0]);

      const minimalItemPreviews = await this.context.$apis.record.find(itemUris, {
        profile: 'minimal',
        rows: params.perPage ? params.perPage : 100
      });

      for (const set of response.items) {
        if (set.items) {
          set.items = set.items.map((uri) => {
            const itemId = uri.replace(EUROPEANA_DATA_URL_ITEM_PREFIX, '');
            return minimalItemPreviews.items.find(item => item.id === itemId) || { id: itemId };
          });
          set.isShownBy = { thumbnail: set.items[0].edmPreview };
        }
      }
    }

    return response;
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

  /**
   * Get a set with given id
   * @param {string} id the set's id
   * @param {Object} params retrieval params
   * @param {string} params.profile the set's metadata profile minimal/standard/itemDescriptions
   * @param {string} params.page the set's page for item retrieval
   * @param {string} params.perPage the number of items per page of results
   * @return {Object} the set's object, containing the requested window of the set's items
   */
  // TODO: pagination for sets with > 100 items
  get(id, params = {}) {
    const defaults = {
      profile: 'meta'
    };
    const paramsWithDefaults = { ...defaults, ...params };

    // TODO: rm when new version is in production
    if (this.config.version === '0.12') {
      // get requests with pagination remove item metadata, use them without pagination
      if (paramsWithDefaults.page) {
        delete paramsWithDefaults.page;
      }
      if (paramsWithDefaults.perPage) {
        delete paramsWithDefaults.perPage;
      }
      // check for meta profile
      if (paramsWithDefaults.profile === 'meta') {
        paramsWithDefaults.profile = 'minimal';
      }
      // check for items profile
      if (paramsWithDefaults.profile === 'items') {
        paramsWithDefaults.profile = 'standard';
      }
      // check for items.meta profile
      if (paramsWithDefaults.profile === 'items.meta') {
        paramsWithDefaults.profile = 'itemDescriptions';
      }
    }

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
      visibility: EUROPEANA_SET_VISIBILITY_PRIVATE
    });
  }

  /**
   * Create a set
   * @param {Object} data Set body
   * @return {Object} API response data
   */
  create(data) {
    // TODO: rm when new version is in production
    if (this.config.version === '0.12') {
      delete data.collectionType;
    }
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
    // TODO: rm when new version is in production
    if (this.config.version === '0.12') {
      delete data.collectionType;
    }
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
    itemIds = [].concat(itemIds);

    // TODO: rm when new version is in production
    if (this.config.version === '0.12') {
      for (let i = 0; i < itemIds.length; i = i + 1) {
        // need to do one at a time so that positioning works as intended
        await this.request({
          method: 'put',
          url: `/${setIdFromUri(setId)}${itemIds[i]}`,
          params: { position: position + i }
        });
      }
    } else {
      return this.request({
        method: 'put',
        url: `/${setIdFromUri(setId)}/items`,
        data: itemIds,
        params: { position }
      });
    }
  }

  /**
   * Delete item(s) from a set
   * @param {string} setId the set's id
   * @param {string,array} itemIds the ID(s) of the item(s) to delete
   * @return {Promise,Promise[]} API request(s)
   */
  deleteItems(setId, itemIds) {
    itemIds = [].concat(itemIds);

    // TODO: rm when new version is in production
    if (this.config.version === '0.12') {
      const requests = [];
      for (const itemId of itemIds) {
        requests.push(
          this.request({
            method: 'delete',
            url: `/${setIdFromUri(setId)}${itemId}`
          })
        );
      }
      return Promise.all(requests);
    } else {
      return this.request({
        method: 'delete',
        url: `/${setIdFromUri(setId)}/items`,
        data: itemIds
      });
    }
  }

  getItemIds(id) {
    return this.get(id, {
      page: 1,
      pageSize: 100,
      profile: 'items'
    }).then((response) => response?.items);
  }

  getItems(id) {
    return this.get(id, {
      page: 1,
      pageSize: 100,
      profile: 'items.meta'
    }).then((response) => response?.items);
  }

  repositionItem(setId, itemId, position) {
    return this.deleteItems(setId, itemId)
      .then(() => this.insertItems(setId, itemId, position));
  }

  searchItems(setId, itemIds) {
    return this.request({
      method: 'get',
      url: `/${setIdFromUri(setId)}/items/search`,
      params: {
        profile: 'items',
        qf: [].concat(itemIds).map((itemId) => `item:${itemId}`),
        query: '*'
      }
    });
  }
}
