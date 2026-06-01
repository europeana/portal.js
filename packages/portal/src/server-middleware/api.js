import defu  from 'defu';

import { createApiExpressApp } from './api/index.js';
import nuxtConfig from '../../nuxt.config.js';

const nuxtRuntimeConfig = defu(nuxtConfig.privateRuntimeConfig, nuxtConfig.publicRuntimeConfig);

export default createApiExpressApp({ $config: nuxtRuntimeConfig });
