import axios from 'axios';

const LOCALISE = false;
const PICK = false;

const data = async(config = {}) => {
  const response = await axios.get('/', {
    baseURL: config.matomo.host,
    params: {
      date: 'yesterday',
      format: 'JSON',
      idSite: config.matomo.siteId,
      method: 'VisitsSummary.get',
      module: 'API',
      period: 'day',
      'token_auth': config.matomo.authToken
    }
  });

  return response.data?.['nb_visits'];
};

export {
  data,
  LOCALISE,
  PICK
};
