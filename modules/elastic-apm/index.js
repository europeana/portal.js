import path from 'path';
import apm from 'elastic-apm-node';
import merge from 'deepmerge';

const MODULE_NAME = 'elastic-apm';

export default function() {
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: path.join(MODULE_NAME, 'plugin.js')
  });

  this.nuxt.hook('ready', async(nuxt) => {
    // $config is not available here, so read runtime config manually
    // TODO: find a better way of doing this
    const $config = merge(nuxt.options.publicRuntimeConfig, nuxt.options.privateRuntimeConfig);
    const config = ($config.elastic ? $config.elastic.apm : undefined) || {};

    if (!config.serverUrl) return;

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
