import axios from 'axios';

const LOCALISE = false;
const PICK = false;

const data = async(context = {}) => {
  const config = context.$config?.matomo || {};

  const response = await axios.get('/', {
    baseURL: config.host,
    params: {
      date: 'last30',
      format: 'JSON',
      idSite: config.siteId,
      method: 'VisitsSummary.get',
      module: 'API',
      period: 'day',
      'token_auth': config.authToken
    }
  });

  // Matomo REST API sometimes returns 200 status code for errors, but with
  // `result` JSON field being "error"
  if ((response.status !== 200) || (response.data.result === 'error')) {
    throw new Error('Failed to get visits data from Matomo');
  }

  const totalVisits = Object.keys(response.data)
    .reduce((memo, date) => memo + (response.data[date]['nb_visits'] || 0), 0);

  return Math.round(totalVisits / Object.keys(response.data).length);
};

export {
  data,
  LOCALISE,
  PICK
};
