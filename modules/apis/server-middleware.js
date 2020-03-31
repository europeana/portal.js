const axios = require('axios');
const express = require('express');
const path = require('path');

const { requestOrigin } = require(path.resolve(__dirname, '../../plugins/http'));

const config = require('./config');

const app = express();

// TODO: enforce SSL unless disabled by env var, with env-configurable port awareness
app.get('/:locale/item/:dataset/:item.json', (req, res) => {
  const europeanaId = `/${req.params.dataset}/${req.params.item}`;
  const reqOrigin = requestOrigin(req);
  const apiConfig = config[reqOrigin] || config.defaults;

  let apiPath = apiConfig.record.path;
  if (!apiPath.endsWith('/record')) apiPath += '/record';

  axios.get(`${apiConfig.record.origin}${apiPath}${europeanaId}.json`, {
    params: {
      wskey: apiConfig.record.key
    }
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(error.response.status || 500);
      res.json(error.response.data);
    });
});

export default app;
