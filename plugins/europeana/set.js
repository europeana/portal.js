import axios from 'axios';
import { config } from './';
import { apiError } from './utils';
import { genericThumbnail } from './thumbnail';

function setApiUrl(endpoint) {
  return `${config.set.origin}${config.set.path}${endpoint}`;
}

export default ($axios) => ({
  /**
   * Filters Hit response with scope string
   * @param  {Object} hits API response
   * @param  {string} id Item item
   * @return {Object} returns selector object
   */
  hitForItem(hits, id) {
    const selector = hits.find((hit) => id === hit.scope);
    return selector ? { selector: selector.selectors[0] } : {};
  },

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
   * Get a set with given id
   * @param {string} id the set's id
   * @param {string} page the set's current page
   * @param {string} pageSize the set-page's size
   * @return {Object} the set's object, containing the requested window of the set's items
   */
  async getSet(id, page, pageSize) {
    return await $axios
      .get(setApiUrl(`/${id}?profile=standard&page=${page}&pageSize=${pageSize}`))
      .then(async response => {
        if (response.data.items) {
          await this.getSetItems(response.data.items, page, pageSize)
            .then(items => {
              const results = items.map(item => {
                return {
                  ...{
                    europeanaId: item.id,
                    edmPreview: item.edmPreview ? `${item.edmPreview[0]}&size=w200` : genericThumbnail(item.id, { type: item.type, size: 'w200' }),
                    dcTitle: item.dcTitleLangAware,
                    dcDescription: item.dcDescriptionLangAware,
                    dcCreator: item.dcCreatorLangAware,
                    edmDataProvider: item.dataProvider
                  },
                  ...(response.data.hits === undefined ? {} : this.hitForItem(response.data.hits, item.id))
                };
              });
              response.data.items = results;
            });
        }
        return response.data;
      })
      .catch((error) => {
        throw apiError(error);
      });
  },

  /**
   * Get the items of a set with given id
   * @param {Array} itemIds the list of the set's items' ids
   * @param {string} page the set's current page
   * @param {string} pageSize the set-page's size
   * @return {Array} the list of the set's items' objects
   */
  // TODO: Use this Search API call temporarily, until item-descriptions profile is ready
  getSetItems(itemIds, page, pageSize) {
    let query = '(' + itemIds.map(s => s.split('item')[1]).map(u => `"${u}"`).join(' OR ') + ')';
    return axios
      .get(`https://api.europeana.eu/record/search.json?wskey=${process.env.EUROPEANA_RECORD_API_KEY}&profile=minimal&rows=${pageSize}&start=${((page - 1) * pageSize) + 1}&query=europeana_id:${query}`)
      .then(response => {
        return response.data.items;
      })
      .catch(error => (console.error(error)));
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
