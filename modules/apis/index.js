const path = require('path');

const { MODULE_NAME } = require('./constants');

module.exports = async function() {
  this.addTemplate({
    src: path.resolve(__dirname, 'templates', 'config.js'),
    fileName: path.join(MODULE_NAME, 'config.js')
  });

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: path.join(MODULE_NAME, 'plugin.js')
  });

  this.addServerMiddleware(path.resolve(__dirname, 'server-middleware.js'));
};
