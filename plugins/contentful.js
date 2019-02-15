const contentful = require('contentful');

// These values will be set via env vars.
// If this file is imported these values may be available to the client.
const config = {
  space: process.env.CTF_SPACE_ID,
  accessToken: process.env.CTF_CDA_ACCESS_TOKEN
};

function createClient () {
  return contentful.createClient(config);
}

export default createClient();
