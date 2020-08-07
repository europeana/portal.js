const path = require('path');

const MODULE_NAME = 'europeana-apis';

module.exports = async function() {
  this.addTemplate({
    src: path.resolve(__dirname, 'rc.js'),
    fileName: path.join(MODULE_NAME, 'rc.js')
  });

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: path.join(MODULE_NAME, 'plugin.js')
  });

  // FIXME: this is broken with the switch to using Nuxt runtime config
  // this.addServerMiddleware(path.resolve(__dirname, 'server-middleware.js'));
};
