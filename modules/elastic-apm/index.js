import path from 'path';

const MODULE_NAME = 'elastic-apm';

export default function() {
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.client.js'),
    fileName: path.join(MODULE_NAME, 'plugin.client.js')
  });

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.server.js'),
    fileName: path.join(MODULE_NAME, 'plugin.server.js')
  });
}
