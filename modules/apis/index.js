const path = require('path');

const { MODULE_NAME } = require('./constants');

const config = require('./config');

module.exports = async function() {
  this.addTemplate({
    src: path.resolve(__dirname, 'config.js'),
    fileName: path.join(MODULE_NAME, 'config.js')
  });

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: path.join(MODULE_NAME, 'plugin.js'),
    options: config
  });

  this.addServerMiddleware(path.resolve(__dirname, 'server-middleware.js'));
};
