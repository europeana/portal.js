const merge = require('deepmerge');

const generateMultiOriginConfiguration = (defaults, originOverrides) => {
  const config = {
    defaults: { ...defaults }
  };

  for (const origin in originOverrides) {
    config[origin] = {};
    for (const api in defaults) {
      config[origin][api] = merge(defaults[api], originOverrides[origin][api] || {});
    }
  }

  return config;
};

module.exports = generateMultiOriginConfiguration;
