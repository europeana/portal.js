import { init as initApm } from '@elastic/apm-rum';

export default () => {
  // This is a template plugin.
  // Doc: https://nuxtjs.org/guide/modules#template-plugins
  const pluginOptions = <%= JSON.stringify(options, null, 2) %>;

  initApm(pluginOptions);
};
