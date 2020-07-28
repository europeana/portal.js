import { config } from './';
import { apiError } from './utils';

function setApiUrl(endpoint) {
  return `${config.set.origin}${config.set.path}${endpoint}`;
}

export default $axios => ({

  /**
 * Create a set with a fixed title "LIKES"
 * @return {Object} API response data
 */
  createLikes() {
    return $axios.post(setApiUrl('/'),
      {
        title: {
          en: 'LIKES'
        }
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

