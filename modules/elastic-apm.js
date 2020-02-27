import path from 'path';
import elasticApmNode from 'elastic-apm-node';

export default function(moduleOptions) {
  if (!moduleOptions.serverUrl) return;

  // TODO: does it need a serviceToken as well? (which will need to be kept secret)
  elasticApmNode.start(moduleOptions);

  this.addPlugin({
    src: path.resolve(__dirname, '../plugins/elastic-apm-rum.js'),
    mode: 'client',
    options: moduleOptions
  });
}
