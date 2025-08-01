import apm from 'elastic-apm-node';
import defu from 'defu';
import path from 'path';

const MODULE_NAME = 'elastic-apm';

export default function() {
  for (const filename of ['plugin.client.js', 'plugin.server.js', 'utils.js']) {
    this.addPlugin({
      src: path.resolve(__dirname, filename),
      fileName: path.join(MODULE_NAME, filename)
    });
  }

  this.nuxt.hook('ready', async(nuxt) => {
    const runtimeConfig = defu(nuxt.options.privateRuntimeConfig, nuxt.options.publicRuntimeConfig);
    const config = runtimeConfig.elastic?.apm || {};

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
      await import('http');
      await import('http2');
      await import('https');
    }
  });
}
