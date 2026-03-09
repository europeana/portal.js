import { setCacheControl } from './utils.js';

export default (ctx) => setCacheControl(ctx, (config) => config.default);
