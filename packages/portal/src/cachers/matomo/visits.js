import axios from 'axios';

const LOCALISE = false;
const PICK = false;

const data = async(config = {}) => {
  const response = await axios.get('/', {
    baseURL: config.matomo.host,
    params: {
      date: 'last30',
      format: 'JSON',
      idSite: config.matomo.siteId,
      method: 'VisitsSummary.get',
      module: 'API',
      period: 'day',
      'token_auth': config.matomo.authToken
    }
  });

  const totalVisits = Object.keys(response.data)
    .reduce((memo, date) => memo + (response.data[date]['nb_visits'] || 0), 0);

  return Math.round(totalVisits / Object.keys(response.data).length);
};

export {
  data,
  LOCALISE,
  PICK
};
