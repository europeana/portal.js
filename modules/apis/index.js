import cosmiconfig from 'cosmiconfig';
import merge from 'deepmerge';
import path from 'path';

import defaults from './defaults';

export default async function() {
  let rc = {};
  if (process.env['EUROPEANA_APIS']) {
    rc = JSON.parse(process.env['EUROPEANA_APIS']);
  } else {
    const configSearch = await cosmiconfig('apis').searchSync();
    if (configSearch) rc = configSearch.config;
  }

  const options = { defaults: merge(defaults, rc.defaults || {}) };

  for (const origin in rc) {
    if (origin !== 'defaults') {
      options[origin] = {};
      for (const api in options.defaults) {
        options[origin][api] = merge(options.defaults[api], rc[origin][api] || {});
      }
    }
  }

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'apis.js',
    options
  });
}
