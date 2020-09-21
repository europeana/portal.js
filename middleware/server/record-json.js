// TODO: check this is working with custom API URL in request header. with curl.

const axios = require('axios');

import apiConfig from '../../plugins/europeana';
import { apiUrlFromRequestHeaders } from '../../plugins/europeana/utils';

export default (req, res, next) => {
  const urlMatch = req.url.match(/^\/[a-z]{2}\/item(\/[^/]+\/[^/]+)\.json$/);
  if (!urlMatch) return next();

  let baseUrl = apiUrlFromRequestHeaders('record', req.headers) || apiConfig.record.url;
  if (!baseUrl.endsWith('/record')) baseUrl += '/record';

  const europeanaId = urlMatch[1];

  axios.get(`${baseUrl}${europeanaId}.json`, {
    params: {
      wskey: apiConfig.record.key
    }
  })
    .then((response) => {
      const deprecationNotice = '**** THIS .json METHOD IS DEPRECATED AND WILL BE REMOVED IN A FUTURE RELEASE. PLEASE VISIT /debug INSTEAD. ****';
      res.json({
        warning: deprecationNotice,
        ...response.data
      });
    })
    .catch((error) => {
      res.status(error.response.status || 500);
      res.json(error.response.data);
    });
};
