import apm from 'elastic-apm-node';
import { parseRoute } from './utils';

// Server-side plugin to set the transaction name based on the Vue route.
export default ({ route, req, app }, inject) => {
  if (!apm.isStarted())  {
    return;
  }

  const parsed = parseRoute(route, { localeCodes: app.i18n?.localeCodes });

  apm.setTransactionName(`${req.method} ${parsed.path}`);
  if (parsed.locale) {
    apm.addLabels({ locale: parsed.locale });
  }

  inject('apm', apm);
};
