import path from 'path';
import apm from 'elastic-apm-node';
import defu  from 'defu';

const MODULE_NAME = 'elastic-apm';

export default function() {
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: path.join(MODULE_NAME, 'plugin.js')
  });

  this.nuxt.hook('ready', async(nuxt) => {
    const runtimeConfig = defu(nuxt.options.privateRuntimeConfig, nuxt.options.publicRuntimeConfig);
    const config = (runtimeConfig.elastic && runtimeConfig.elastic.apm) || {};

    if (!config.serverUrl) {
      return;
    }

    if (!apm.isStarted())  {
      await apm.start(config);

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
