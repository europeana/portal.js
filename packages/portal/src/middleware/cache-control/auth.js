import { setCacheControl } from './utils.js';

export default (ctx) => setCacheControl(ctx, (config) => ctx.$auth?.user?.loggedIn ? config.auth : null);
