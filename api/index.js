// INDEX.JS

const express = require('express');
const app = express();
import {createClient} from './contentful.js';

app.get('/', (req, res) => {
  res.send('API root');
});

app.get('/contentful/:id', async (req, res) => {
  const contentfulClient = createClient();
  const element = await contentfulClient.getEntry(req.params.id, { 'include': 2 }) ;
  res.json(element);
});

// export the server middleware
module.exports = {
  path: '/api',
  handler: app
};
