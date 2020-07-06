import path from 'path';

const MODULE_NAME = 'http';

const defaults = {
  ports: {
    http: null,
    https: null
  },
  sslNegotiation: {
    enabled: false,
    datasetBlacklist: []
  }
};

export default function(moduleOptions) {
  const config = {
    ...defaults,
    ...moduleOptions
  };

  this.addTemplate({
    src: path.resolve(__dirname, path.join('templates', 'config.ejs')),
    fileName: path.join(MODULE_NAME, 'config.js'),
    options: config
  });

  this.addTemplate({
    src: path.resolve(__dirname, path.join('templates', 'utils.js')),
    fileName: path.join(MODULE_NAME, 'utils.js')
  });

  this.addTemplate({
    src: path.resolve(__dirname, path.join('templates', 'store.js')),
    fileName: path.join(MODULE_NAME, 'store.js')
  });

  this.addPlugin({
    src: path.resolve(__dirname, path.join('templates', 'middleware.js')),
    fileName: path.join(MODULE_NAME, 'middleware.js')
  });

  this.addPlugin({
    src: path.resolve(__dirname, path.join('templates', 'plugin.js')),
    fileName: path.join(MODULE_NAME, 'plugin.js')
  });

  this.options.router.middleware.push('http');
}
