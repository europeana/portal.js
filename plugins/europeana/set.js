import { config } from './';
import { apiError } from './utils';
import { search } from './search';
import axios from 'axios';

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
    return $axios.get(setApiUrl('/search?query=' + 'creator:' + creator + '+type:BookmarkFolder'))
      .then((response) => {
        return response.data.items ? (response.data.items[0]).split('/').pop() : '';
      })
      .catch((error) => {
        throw apiError(error);
      });
  },

  /**
 * Get sets for user
 * @param {string} creator the creator's id
 * @param {string} visibility the set's visibility, can be either 'public' or 'private'
 * @param {string} profile the set profile, can be either 'minimal' or 'standard'
 * @return {Array} the ids of the sets
 */
  async getSetsByCreator(creator, visibility, profile) {
    const vs = visibility ? '+visibility:' + visibility : '';
    const prof = profile ? '&profile=' + profile : '';

    return $axios.get(setApiUrl('/search?query=creator:' + creator + vs + prof))
      .then((response) => {
        const responseSets = response.data.items ? response.data.items : [];
        return responseSets.map(set => set.split('/').pop());
      }).catch((error) => {
        throw apiError(error);
      });
  },

  /**
 * Get all set metadata for the provided set ids
 * @param {Array} ids the ids of sets to retrieve
 * @return {Object[]} an array of sets
 */
  async getAllSets(ids) {
    return axios.all(ids.map(id => $axios.get(setApiUrl('/') + id + '?profile=standard')))
      .then(responseArray => {
        return responseArray.map(set => {
          return {
            id: set.data.id.split('/').pop(),
            title: set.data.title,
            description: set.data.description,
            firstItem: set.data.items ? '/' + set.data.items[0].split('/item/')[1] : null,
            total: set.data.total

          };
        });
      }).catch((error) => {
        throw apiError(error);
      });
  },

  /**
 * Get a set image for every set containg at least one item from the given set array
 * @param {Object[]} sets the sets for which to retrieve images
 * @return {Object[]} the initial sets with a thumbnail property added for each set that contains at least one item
 */
  async getSetImages(sets) {
    let q = sets.map(e => e.firstItem).filter(Boolean).join('" OR "');
    if (!q) {
      return sets;
    }
    const results =  await search(
      {
        query: `europeana_id:("${q}")`
      });

    sets.forEach((set, index) => {
      let result = results.results.find(res => res.europeanaId === set.firstItem);
      if (result) {
        sets[index] = { ...sets[index], thumbnail: result.edmPreview };
      }
    });
    return sets;
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

