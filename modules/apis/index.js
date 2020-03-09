import cosmiconfig from 'cosmiconfig';
import merge from 'deepmerge';
import path from 'path';

import defaults from './defaults';

const loadRuntimeConfiguration = async() => {
  let rc = {};

  if (process.env['EUROPEANA_APIS']) {
    rc = JSON.parse(process.env['EUROPEANA_APIS']);
  } else {
    const configSearch = await cosmiconfig('apis').searchSync();
    if (configSearch) rc = configSearch.config;
  }

  return rc;
};

const generateMultiOriginConfiguration = async() => {
  const rc = await loadRuntimeConfiguration();

  const options = { defaults: merge(defaults, rc.defaults || {}) };

  for (const origin in rc) {
    if (origin !== 'defaults') {
      options[origin] = {};
      for (const api in options.defaults) {
        options[origin][api] = merge(options.defaults[api], rc[origin][api] || {});
      }
    }
  }

  return options;
};

export default async function() {
  const options = await generateMultiOriginConfiguration();

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'apis.js',
    options
  });
}
