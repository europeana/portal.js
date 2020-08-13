import { config } from './';
import { apiError } from './utils';

const setApiUrl = (endpoint) => `${config.set.origin}${config.set.path}${endpoint}`;

const setIdFromUri = (uri) => uri.split('/').pop();

export default ($axios) => ({
  search(params) {
    return $axios.get(setApiUrl('/search'), { params })
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
   * Get set by id
   * @param {string} id the set id
   * @param {string} profile the set profile, can be either 'minimal' or 'standard'
   * @return {Object} API response data
   */
  getSet(id, profile) {
    return $axios.get(setApiUrl(`/${id}`), { params: { profile } })
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
    return $axios.post(setApiUrl('/'),
      {
        type: 'BookmarkFolder',
        title: {
          en: 'LIKES'
        },
        visibility: 'private'
      }
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
   * @param {string} itemId the id of the item to be added or deleted
   * @return {Object} API response data
   */
  modifyItems(action, setId, itemId) {
    const apiCall = action === 'add' ? $axios.put : $axios.delete;
    return apiCall(setApiUrl(`/${setId}/${itemId}`))
      .then(response => response.data)
      .catch(error => {
        throw apiError(error);
      });
  }
});
