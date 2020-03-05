import cosmiconfig from 'cosmiconfig';
import merge from 'deepmerge';
import path from 'path';

import defaults from './defaults';

export default async function() {
  const rc = process.env['EUROPEANA_APIS'] ? JSON.parse(process.env['EUROPEANA_APIS']) :
    (await cosmiconfig('apis').searchSync().config);
  if (!rc) throw new Error('Europeana API configuration not found in ENV or config file.');

  const options = { defaults: merge(defaults, rc.defaults) };

  for (const origin in rc) {
    if (origin !== 'defaults') {
      options[origin] = {};
      for (const api in rc[origin]) {
        options[origin][api] = merge(options.defaults[api], rc[origin][api]);
      }
    }
  }

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'apis.js',
    options
  });
}
