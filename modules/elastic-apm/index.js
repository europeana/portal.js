import path from 'path';
import apm from 'elastic-apm-node';

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

  this.nuxt.hook('ready', async() => {
    if (!apm.isStarted())  {
      await apm.start(moduleOptions);

      // Now explicitly require the modules we want APM to hook into, as otherwise
      // they would not be instrumented.
      //
      // Docs: https://www.elastic.co/guide/en/apm/agent/nodejs/master/custom-stack.html
      // Modules: https://github.com/elastic/apm-agent-nodejs/tree/v3.9.0/lib/instrumentation/modules
      require('http');
      require('http2');
      require('https');
    }
  });
}
