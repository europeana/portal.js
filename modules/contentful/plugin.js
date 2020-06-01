import axios from 'axios';

const queries = <%= JSON.stringify(options, null, 2) %>;

// TODO: move into own template
const query = (alias, variables) => {
  return axios.post(
    `https://graphql.contentful.com/content/v1/spaces/${process.env['CTF_SPACE_ID']}/environments/${process.env['CTF_ENVIRONMENT_ID']}`,
    {
      query: queries[alias],
      variables
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env['CTF_CDA_ACCESS_TOKEN']}`
      }
    }
  );
};

const plugin = {
  query
};

export default ({ app }, inject) => {
  app.$contentful = plugin;
  inject('contentful', plugin);
};
