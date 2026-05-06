import { setCacheControl } from './utils.js';

export default (ctx) => setCacheControl(ctx, (config) => ctx.$keycloak?.loggedIn ? config.auth : null);
