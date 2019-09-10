const contentful = require('contentful');

// These values will be set via env vars.
// If this file is imported these values may be available to the client.
const deliveryConfig = {
  space: process.env.CTF_SPACE_ID,
  accessToken: process.env.CTF_CDA_ACCESS_TOKEN
};
const previewConfig = {
  space: process.env.CTF_SPACE_ID,
  accessToken: process.env.CTF_CPA_ACCESS_TOKEN,
  host: 'preview.contentful.com'
};

export function createClient(mode) {
  const config = (mode === 'preview' ? previewConfig : deliveryConfig);
  try {
    return contentful.createClient(config);
  } catch (error) {
    return {};
  }
}

export default createClient();
