const contentful = require('contentful');
const flatten = require('lodash/flatten');

// These values will be set via env vars.
// If this file is imported these values may be available to the client.
const deliveryConfig = {
  space: process.env.CTF_SPACE_ID,
  environment: process.env.CTF_ENVIRONMENT_ID || 'master',
  accessToken: process.env.CTF_CDA_ACCESS_TOKEN,
  host: process.env.CTF_CDA_HOST || 'cdn.contentful.com',
  insecure: Boolean(Number(process.env.CTF_INSECURE))
};
const previewConfig = {
  space: process.env.CTF_SPACE_ID,
  environment: process.env.CTF_ENVIRONMENT_ID || 'master',
  accessToken: process.env.CTF_CPA_ACCESS_TOKEN,
  host: 'preview.contentful.com'
};

export const getLinkedItems = async(items, linkField, options = {}) => {
  const defaults = {
    limit: 1,
    include: 0
  };
  const config = { ...defaults, ...options };

  const contentfulClient = createClient(config.mode);

  const linkedItemIds = flatten(items
    .map(item => item.fields[linkField].slice(0, config.limit)
      .map(linkedItem => linkedItem.sys.id)));

  await contentfulClient.getEntries({
    'sys.id[in]': linkedItemIds.join(','),
    include: config.include
  })
    .then((response) => {
      for (const item of items) {
        const itemLinkedItemIds = item.fields[linkField].slice(0, config.limit).map(linkedItem => linkedItem.sys.id);
        item.fields[linkField] = response.items.filter(linkedItem => itemLinkedItemIds.includes(linkedItem.sys.id));
      }
    });

  return items;
};

export default function createClient(mode) {
  const config = (mode === 'preview' && process.env.CTF_CPA_ACCESS_TOKEN ? previewConfig : deliveryConfig);
  return contentful.createClient(config);
}
