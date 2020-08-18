import { config } from './';
import { apiError } from './utils';

const setApiUrl = (endpoint) => `${config.set.origin}${config.set.path}${endpoint}`;

const setIdFromUri = (uri) => uri.split('/').pop();

const paramsWithApiKey = (params = {}) => {
  return { ...params, wskey: config.set.key };
};

export default ($axios) => ({
  search(params) {
    return $axios.get(setApiUrl('/search'), { params: paramsWithApiKey(params) })
      .then(response => response)
      .catch(error => {
        throw apiError(error);
      });
  },

  /**
   * Get the user's set with type BookmarkFolder
   * @param {string} creator the creator's id
   * @return {String} the id of the set
   */
  getLikes(creator) {
    return this.search({ query: `creator:${creator} type:BookmarkFolder` })
      .then(response => response.data.items ? setIdFromUri(response.data.items[0]) : null)
      .catch(error => {
        throw apiError(error);
      });
  },

  /**
   * Get a set with given id
   * @param {string} id the set's id
   * @param {Object} options retrieval options
   * @param {string} options.page the set's current page
   * @param {string} options.pageSize the set-page's size
   * @param {string} options.profile the set's metadata profile
   * @return {Object} the set's object, containing the requested window of the set's items
   */
  getSet(id, options = {}) {
    const defaults = {
      page: 0,
      pageSize: 24,
      profile: 'standard'
    };
    const params = paramsWithApiKey({ ...defaults, ...options });

    return $axios.get(setApiUrl(`/${id}`), { params })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw apiError(error);
      });
  },

  /**
   * Create a set of type BookmarkFolder with a fixed title
   * @return {Object} API response data
   */
  createLikes() {
    return this.createSet({
      type: 'BookmarkFolder',
      title: {
        en: 'LIKES'
      },
      visibility: 'private'
    });
  },

  /**
   * Create a set
   * ~param {Object} body Set body
   * @return {Object} API response data
   */
  createSet(body) {
    return $axios.post(
      setApiUrl('/'),
      body,
      { params: paramsWithApiKey() }
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
   * @return {Object} API response data
   */
  modifyItems(action, setId, itemId) {
    const apiCall = action === 'add' ? $axios.put : $axios.delete;
    return apiCall(setApiUrl(`/${setIdFromUri(setId)}${itemId}`), { params: paramsWithApiKey() })
      .then(response => response.data)
      .catch(error => {
        throw apiError(error);
      });
  },

  getSetThumbnail(set) {
    const firstItemWithEdmPreview = (set.items || []).find(item => item.edmPreview);
    return firstItemWithEdmPreview ? firstItemWithEdmPreview.edmPreview[0] : null;
  }
});
