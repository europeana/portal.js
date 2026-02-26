// convenience middleware to apply the cache-control header value from
// APP_CACHE_CONTROL_CONTENTFUL env var instead of having to set
// route-specific config values for each Contentful-based page view

import { setCacheControl } from './utils.js';

export default (ctx) => setCacheControl(ctx, (config) => config.contentful);
