import path from 'path';

export default function(moduleOptions) {
  if (!moduleOptions.serverUrl) return;

  this.addPlugin({
    src: path.resolve(__dirname, '../plugins/elastic-apm-rum.js'),
    mode: 'client',
    options: moduleOptions
  });
}
