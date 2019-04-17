import axios from 'axios';
import qs from 'qs';

function getEntity(params) {
  return axios.get('https://api.europeana.eu/api/v2/search.json', {
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
    params: {
      profile: 'facets',
      facet: 'edm_agent,skos_concept',
      query: params.query == '' ? '*:*' : params.query,
      rows: 0,
      wskey: params.wskey
    }
  })
    .then((response) => {
      return {
        error: null,
        facets: response.data.facets || null
      };
    })
    .catch((error) => {
      const message = error.response ? error.response.data.error : error.message;
      throw new Error(message);
    });
}

export default getEntity;
