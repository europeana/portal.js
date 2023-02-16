const PICK = ['name', 'description', 'identifier', 'primaryImageOfPage'];
const LOCALISE_CONTENTFUL = ['name', 'description'];

import contentful from 'contentful';
// load src/modules/contentful/, for graphql. How?

let ctfClient;

const contentfulVariables = {
  locale: 'en-GB',
  preview: false
};

const data = (config = {}) => {
  const ctfClient = contentful.createClient({
    ...config.contentful // This doesn't work since the config is for the graphql module
  });

  return ctfClient.query('themes-multilingual', contentfulVariables);
};

export {
  data,
  LOCALISE_CONTENTFUL,
  PICK
};
