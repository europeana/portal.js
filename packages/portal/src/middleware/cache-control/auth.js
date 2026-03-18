import { setCacheControl } from './utils.js';

export default (ctx) => setCacheControl(ctx, (config) => ctx.$auth?.loggedIn ? config.auth : null);
