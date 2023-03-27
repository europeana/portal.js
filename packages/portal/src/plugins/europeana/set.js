import { ITEM_URL_PREFIX as EUROPEANA_DATA_URL_ITEM_PREFIX } from './data.js';
import { apiError, createKeycloakAuthAxios } from './utils.js';

export const BASE_URL = 'https://api.europeana.eu/set';
export const AUTHENTICATING = true;
export const EUROPEANA_SET_VISIBILITY_PRIVATE = 'private';
export const EUROPEANA_SET_VISIBILITY_PUBLIC = 'public';
export const EUROPEANA_SET_VISIBILITY_PUBLISHED = 'published';

const setIdFromUri = (uri) => uri.split('/').pop();

export default (context = {}) => {
  const $axios = createKeycloakAuthAxios(
    { id: 'set', baseURL: BASE_URL, $axios: context.$axios },
    context
  );

  // Set API has some issues w/ caching, returning stale responses
  // TODO: remove when resolved upstream
  $axios.defaults.headers.get['cache-control'] = 'no-cache';
  $axios.defaults.headers.get['pragma'] = 'no-cache';

  return {
    $axios,

    /**
     * Search for user sets
     * @param {Object} params retrieval params to send to Set API search method
     * @param {Object} options retrieval options
     * @param {Boolean} options.withMinimalItemPreviews retrieve minimal item metadata from Record API for first item in each set
     */
    async search(params, options = {}) {
      try {
        const response = await $axios.get('/search', { params: { ...$axios.defaults.params, ...params } });

        if (options.withMinimalItemPreviews && response.data.items) {
          const itemUris = response.data.items.filter(set => set.items).map(set => set.items[0]);

          const minimalItemPreviews = await context.$apis.record.find(itemUris, {
            profile: 'minimal',
            rows: params.perPage ? params.perPage : 100
          });

          for (const set of response.data.items) {
            if (set.items) {
              set.items = set.items.map(uri => {
                const itemId = uri.replace(EUROPEANA_DATA_URL_ITEM_PREFIX, '');
                return minimalItemPreviews.items.find(item => item.id === itemId) || { id: itemId };
              });
            }
          }
        }

        return response;
      } catch (error) {
        throw apiError(error);
      }
    },

    /**
     * Get the user's set with type BookmarkFolder
     * @param {string} creator the creator's id
     * @return {string} the id of the set
     */
    getLikes(creator) {
      return this.search({ query: `creator:${creator} type:BookmarkFolder` })
        .then(response => response.data.items ? response.data.items[0] : null)
        .catch(error => {
          throw apiError(error);
        });
    },

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
      const paramsWithDefaults = { ...$axios.defaults.params, ...defaults, ...params };

      try {
        const response = await $axios.get(`/${setIdFromUri(id)}`, { params: paramsWithDefaults });
        return response.data;
      } catch (error) {
        throw apiError(error);
      }
    },

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
    },

    /**
     * Create a set
     * @param {Object} body Set body
     * @return {Object} API response data
     */
    create(body) {
      return $axios.post(
        '/',
        body
      )
        .then(response => response.data)
        .catch(error => {
          throw apiError(error);
        });
    },

    /**
     * Update a set
     * @param {string} id the set's id
     * @param {Object} body Set body
     * @return {Object} API response data
     */
    update(id, body, params = {}) {
      return $axios.put(
        `/${setIdFromUri(id)}`,
        body,
        { params }
      )
        .then(response => response.data)
        .catch(error => {
          throw apiError(error);
        });
    },

    /**
     * Publish a set
     * @param {string} id the set's id
     * @return {Object} API response data
     */
    publish(id = '') {
      return $axios.put(
        `/${setIdFromUri(id)}/publish`
      )
        .then(response => response.data)
        .catch(error => {
          throw apiError(error);
        });
    },

    /**
     * Unpublish a set
     * @param {string} id the set's id
     * @return {Object} API response data
     */
    unpublish(id = '') {
      return $axios.put(
        `/${setIdFromUri(id)}/unpublish`
      )
        .then(response => response.data)
        .catch(error => {
          throw apiError(error);
        });
    },

    /**
     * Delete a set
     * @param {string} id the set's id
     * @return {Object} API response data
     */
    delete(id) {
      return $axios.delete(
        `/${setIdFromUri(id)}`
      )
        .then(response => response.data)
        .catch(error => {
          throw apiError(error);
        });
    },

    /**
     * Modify the set items by adding or deleting an item
     * @param {string} action the type of modification, can be either 'add' or 'delete'
     * @param {string} setId the id of the set that will be modified
     * @param {string} itemId the id of the item to be added or deleted, with leading slash
     * @param {Boolean} pin if true will indicate that the item is to be pinned
     * @return {Object} API response data
     */
    async modifyItems(action, setId, itemId, pin) {
      const apiCall = action === 'add' ? $axios.put : $axios.delete;
      const pinPos = pin ? '?position=pin' : '';
      return apiCall(`/${setIdFromUri(setId)}${itemId}${pinPos}`)
        .then(response => response.data)
        .catch(error => {
          throw apiError(error);
        });
    }
  };
};
