import axios from 'axios';

const queries = <%= JSON.stringify(options, null, 2) %>;
// TODO: make configurable, e.g. to support proxy/cache
const origin = 'https://graphql.contentful.com';
const path = `/content/v1/spaces/${process.env['CTF_SPACE_ID'] || 'master'}/environments/${process.env['CTF_ENVIRONMENT_ID']}`;

const query = (alias, variables = {}) => {
  const url = `${origin}${path}`;
  const body = {
    query: queries[alias],
    variables
  };
  const headers = {
    'Authorization': `Bearer ${process.env['CTF_CDA_ACCESS_TOKEN']}`
  };

  return axios.post(url, body, { headers })
    .then(data => {
      if (data.errors) throw new Error(data.errors[0].message);
      return data;
    });
};

const plugin = {
  query
};

export default ({ app }, inject) => {
  app.$contentful = plugin;
  inject('contentful', plugin);
};
