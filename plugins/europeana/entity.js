import axios from 'axios';

/**
 * Get the entity data from the API
 * @param {string} id of entity
 * @param {string} type of entity
 * @param {Object} params additional parameters sent to the API
 * @param {string} params.wskey API key
 * @return {Object} parsed entity data
 */
function getEntity(type, id, params) {
  return axios.get(`https://www.europeana.eu/api/entities/${getEntityTypeApi(type)}/base/${getEntityId(id)}`, {
    params: {
      wskey: params.wskey
    }
  })
    .then((response) => {
      return {
        error: null,
        entity: response.data
      };
    })
    .catch((error) => {
      const message = error.response ? error.response.data.error : error.message;
      throw new Error(message);
    });
}

/**
 * Retrieve the API name of the type using the human readable name
 * @param {string} type of entity
 * @return {string} retrieved API name of type
 */
function getEntityTypeApi(type) {
  const names = {
    'people': 'agent',
    'topics': 'concept'
  };
  if (!type) return;
  return names[type];
}

/**
 * Retrieve the entity id from the slug
 * @param {string} url of entity
 * @return {string} retrieved id
 */
function getEntityId(url) {
  if (!url) return;
  return url.split('-')[0];
}

export default getEntity;
