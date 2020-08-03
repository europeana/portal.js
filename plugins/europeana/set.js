import axios from 'axios';
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
   * Get the user's set with type BookmarkFolder
   * @param {string} id the set's id
   * @param {string} page the set's current page
   * @param {string} pageSize the requested page's size
   * @return {Object} the set's object, containing the requested window of the set's items
   */
  async getSet(id, page, pageSize) {
    let uSet = await $axios
      .get(setApiUrl(`/${id}?profile=standard&page=${page}&pageSize=${pageSize}`))
      .then(response => {
        return response.data;
      })
      .catch((error) => {
        throw apiError(error);
      });
    // TODO: Use this Search API call temporarily, until item-descriptions profile is ready
    let q = '(' + uSet.items.map(s => s.split('item')[1]).map(u => `"${u}"`).join(' OR ') + ')';
    uSet.items = await axios
      .get(`https://api.europeana.eu/record/search.json?wskey=${process.env.EUROPEANA_RECORD_API_KEY}&profile=minimal&rows=${pageSize}&start=${((page - 1) * pageSize) + 1}&query=europeana_id:${q}`)
      .then(response => {
        return response.data.items;
      })
      .catch(error => (console.error(error)));
    return uSet;
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
