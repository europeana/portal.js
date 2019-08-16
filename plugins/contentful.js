const contentful = require('contentful');

// These values will be set via env vars.
// If this file is imported these values may be available to the client.
let config = {
  space: process.env.CTF_SPACE_ID,
  accessToken: process.env.CTF_CDA_ACCESS_TOKEN
};

function createClient (preview = false) {
  let client;
  preview;
  if (preview) {
    config.accessToken = process.env.CTF_PREVIEW_CDA_ACCESS_TOKEN;
    config.host = 'preview.contentful.com';
  }
  try {
    client = contentful.createClient(config);
  } catch (error) {
    client = {};
  }
  return client;
}

export default createClient();
