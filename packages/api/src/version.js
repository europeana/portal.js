// Outputs as plain text the version of the app that is running

import portalPackage from '@europeana/portal/package.json' assert { type: 'json' };

export default (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.end(portalPackage.version);
};
