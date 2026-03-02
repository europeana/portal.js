import camelCase from 'lodash/camelCase.js';

import { setCacheControl } from './utils.js';

export default (ctx) => setCacheControl(ctx, (config) => {
  // convert e.g. "item-all___en" to "itemAll"
  const scope = camelCase(ctx.route?.name?.split('___')?.[0]);

  return config.route?.[scope];
});
