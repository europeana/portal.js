import apm from 'elastic-apm-node';
import { parseRoute } from './utils';

// Server-side plugin to set the transaction name based on the Vue route.
export default async({ $config, route, req, app }, inject) => {
  const config = $config?.elastic?.apm || {};

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

  const parsed = parseRoute(route, { localeCodes: app.i18n?.localeCodes });

  apm.setTransactionName(`${req.method} ${parsed.path}`);
  if (parsed.locale) {
    apm.setLabel('locale', parsed.locale);
  }

  inject('apm', apm);
};
