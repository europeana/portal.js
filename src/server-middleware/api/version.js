// Outputs as plain text the version of the app that is running

import versions from '../../../pkg-versions.js';

export default (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.end(versions['@europeana/portal']);
};
