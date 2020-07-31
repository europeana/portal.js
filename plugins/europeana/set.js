import { config } from './';
import { apiError } from './utils';

function setApiUrl(endpoint) {
  return `${config.set.origin}${config.set.path}${endpoint}`;
}

export default ($axios) => ({
/**
 * Get the user's set with type BookmarkFolder
 * @param {string} creator the creator's id
 * @return {String} the id of the set
 */
  getLikes(creator) {
    return $axios.get(setApiUrl('/search?query=creator:' + creator + '+type:BookmarkFolder'))
      .then((response) => {
        return response.data.items ? response.data.items[0].split('/').pop() : '';
      })
      .catch((error) => {
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
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
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
    const apicall = action === 'add' ? $axios.put : $axios.delete;
    return apicall(setApiUrl('/') + setId + '/' + itemId)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw apiError(error);
      });
  }

});

