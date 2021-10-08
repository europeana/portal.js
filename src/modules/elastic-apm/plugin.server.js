import apm from 'elastic-apm-node';
import { transactionPath } from './utils';

// Server-side plugin to set the transaction name based on the Vue route.
export default ({ route, req, app }) => {
  if (!apm.isStarted())  {
    return;
  }

  const path = transactionPath(route, { localeCodes: app.i18n?.localeCodes });

  apm.setTransactionName(`${req.method} ${path}`);
};
