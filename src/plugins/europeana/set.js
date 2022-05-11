import { apiError, createKeycloakAuthAxios } from './utils';

export const BASE_URL = process.env.EUROPEANA_SET_API_URL || 'https://api.europeana.eu/set';

const setIdFromUri = (uri) => uri.split('/').pop();

export default (context = {}) => {
  const $axios = createKeycloakAuthAxios(
    { id: 'set', baseURL: BASE_URL, $axios: context.$axios },
    context
  );

  return {
    $axios,

    search(params) {
      return $axios.get('/search', { params: { ...$axios.defaults.params, ...params } })
        .then(response => response)
        .catch(error => {
          throw apiError(error, context);
        });
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
          throw apiError(error, context);
        });
    },

    /**
     * Get a set with given id
     * @param {string} id the set's id
     * @param {Object} params retrieval options
     * @param {string} params.profile the set's metadata profile minimal/standard/itemDescriptions
     * @return {Object} the set's object, containing the requested window of the set's items
     */
    async get(id, params = {}, options = {}) {
      const defaults = {
        profile: 'standard'
      };
      const paramsWithDefaults = { ...$axios.defaults.params, ...defaults, ...params };

      try {
        const response = await $axios.get(`/${setIdFromUri(id)}`, { params: paramsWithDefaults });
        const set = response.data;

        if (options.withMinimalItems) {
          const itemIdentifiers = set.items.map(uri => uri.replace('http://data.europeana.eu/item', ''));
          const itemQuery = `europeana_id:("${itemIdentifiers.join('" OR "')}")`;
          const searchResponse = await context.$apis.record.search({
            query: itemQuery,
            profile: 'minimal',
            rows: 100,
            qf: ['contentTier:*']
          });
          const dcTitleLangAware = { en: [context.i18n.t('record.status.unpublished')] };
          set.items = itemIdentifiers.map(id => searchResponse.items.find(item => item.id === id) || { id, dcTitleLangAware });
        }

        return set;
      } catch (error) {
        throw apiError(error, context);
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
        visibility: 'private'
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
          throw apiError(error, context);
        });
    },

    /**
     * Update a set
     * @param {string} id the set's id
     * @param {Object} body Set body
     * @return {Object} API response data
     */
    update(id, body) {
      return $axios.put(
        `/${setIdFromUri(id)}`,
        body
      )
        .then(response => response.data)
        .catch(error => {
          throw apiError(error, context);
        });
    },

    /**
     * Delete a set
     * @param {string} id the set's id
     * @return {Object} API response data
     */
    deleteSet(id) {
      return $axios.delete(
        `/${setIdFromUri(id)}`
      )
        .then(response => response.data)
        .catch(error => {
          throw apiError(error, context);
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
          throw apiError(error, context);
        });
    }
  };
};
