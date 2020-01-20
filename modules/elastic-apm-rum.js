import path from 'path';

export default function(moduleOptions) {
  if (!moduleOptions.serverUrl) return;

  console.log('\n\nelastic-apm-rum module', moduleOptions, '\n\n');

  this.addPlugin({
    src: path.resolve(__dirname, '../plugins/elastic-apm-rum.js'),
    options: moduleOptions
  });
}
