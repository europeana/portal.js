import path from 'path';

const MODULE_NAME = 'elastic-apm';

export default function(moduleOptions) {
  if (!moduleOptions.serverUrl) return;

  this.addTemplate({
    src: path.resolve(__dirname, path.join('templates', 'options.ejs')),
    fileName: path.join(MODULE_NAME, 'options.js'),
    options: moduleOptions
  });

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: path.join(MODULE_NAME, 'plugin.js')
  });

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.server.js'),
    fileName: path.join(MODULE_NAME, 'plugin.server.js')
  });
}
